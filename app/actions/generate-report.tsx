"use server";

import { z } from "zod";

/**
 * Schéma de validation pour les données d'export
 */
const exportDataSchema = z.object({
  tf: z.number().finite().positive("TF doit être un nombre positif"),
  tg: z.number().finite().nonnegative("TG doit être un nombre positif ou zéro"),
});

export interface GenerateReportInput {
  tf: number;
  tg: number;
  format: "pdf";
}

export interface GenerateReportResult {
  success: boolean;
  data?: string; // Base64 encoded file data
  error?: string;
  mimeType?: string;
  filename?: string;
}

/**
 * Server Action pour générer un rapport PDF
 * Note: Le PNG est généré côté client avec html2canvas pour éviter les dépendances natives
 *
 * @param input - Données pour la génération du rapport
 * @returns Résultat avec les données binaires en base64 ou une erreur
 */
export async function actionGenerateReport(
  input: GenerateReportInput
): Promise<GenerateReportResult> {
  try {
    // Validation avec Zod
    const validationResult = exportDataSchema.safeParse({
      tf: input.tf,
      tg: input.tg,
    });

    if (!validationResult.success) {
      const firstError = validationResult.error.errors[0];
      return {
        success: false,
        error: firstError.message,
      };
    }

    // Pour le moment, cette Server Action ne gère que le PDF
    // Le PNG est généré côté client avec html2canvas
    if (input.format !== "pdf") {
      return {
        success: false,
        error:
          "Format non supporté côté serveur. Utilisez la génération client-side pour PNG.",
      };
    }

    // Import dynamique pour éviter d'inclure @react-pdf/renderer dans le bundle client
    const { Document, Page, Text, View, StyleSheet, pdf } = await import(
      "@react-pdf/renderer"
    );
    const { COEFFICIENT_LABEL } = await import("@/app/lib/coefficients");

    const styles = StyleSheet.create({
      page: {
        backgroundColor: "#0B0B0B",
        padding: 40,
        fontFamily: "Helvetica",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
      },
      header: {
        marginBottom: 48,
        alignItems: "center",
      },
      title: {
        fontSize: 48,
        fontWeight: "bold",
        color: "#C9A227",
        marginBottom: 8,
      },
      subtitle: {
        fontSize: 18,
        color: "#F4F4F4",
      },
      metricsContainer: {
        width: "100%",
        maxWidth: 600,
        marginBottom: 48,
        gap: 32,
      },
      metricBox: {
        borderWidth: 2,
        borderColor: "#C9A227",
        padding: 32,
        marginBottom: 32,
        borderRadius: 8,
      },
      metricLabel: {
        fontSize: 24,
        color: "#F4F4F4",
        marginBottom: 16,
      },
      metricValue: {
        fontSize: 64,
        fontWeight: "bold",
        color: "#C9A227",
      },
      footer: {
        marginTop: "auto",
        fontSize: 12,
        color: "#F4F4F4",
        textAlign: "center",
      },
    });

    const timestamp = new Date().toLocaleString("fr-FR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

    // Fonction de formatage des nombres avec espace comme séparateur de milliers
    const formatNumber = (value: number): string => {
      const parts = value.toFixed(2).split(".");
      const integerPart = parts[0];
      const decimalPart = parts[1];
      // Ajouter des espaces tous les 3 chiffres en partant de la droite
      const formattedInteger = integerPart.replace(
        /\B(?=(\d{3})+(?!\d))/g,
        " "
      );
      return `${formattedInteger},${decimalPart}`;
    };

    // Créer le document PDF
    const doc = (
      <Document>
        <Page size="A4" style={styles.page}>
          <View style={styles.header}>
            <Text style={styles.title}>HSE-Flow</Text>
            <Text style={styles.subtitle}>Safety Scorecard</Text>
          </View>

          <View style={styles.metricsContainer}>
            <View style={styles.metricBox}>
              <Text style={styles.metricLabel}>Taux de Fréquence (TF)</Text>
              <Text style={styles.metricValue}>{formatNumber(input.tf)}</Text>
            </View>

            <View style={styles.metricBox}>
              <Text style={styles.metricLabel}>Taux de Gravité (TG)</Text>
              <Text style={styles.metricValue}>{formatNumber(input.tg)}</Text>
            </View>
          </View>

          <View style={styles.footer}>
            <Text>Coefficient : {COEFFICIENT_LABEL}</Text>
            <Text>Généré le {timestamp}</Text>
          </View>
        </Page>
      </Document>
    );

    // Générer le PDF
    const pdfBlob = await pdf(doc).toBlob();
    const arrayBuffer = await pdfBlob.arrayBuffer();
    const base64 = Buffer.from(arrayBuffer).toString("base64");

    const filename = `hse-flow-scorecard-${new Date()
      .toISOString()
      .split("T")[0]
      .replace(/-/g, "")}.pdf`;

    return {
      success: true,
      data: base64,
      mimeType: "application/pdf",
      filename,
    };
  } catch (error) {
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Une erreur inattendue s'est produite lors de la génération du rapport",
    };
  }
}
