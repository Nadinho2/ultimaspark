import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";

type CertificatePDFProps = {
  userName: string;
  courseName: string;
  dateString: string;
  certificateId: string;
};

const styles = StyleSheet.create({
  page: {
    flexDirection: "column",
    backgroundColor: "#05080F",
    padding: 40,
  },
  border: {
    flex: 1,
    borderWidth: 2,
    borderColor: "#6366F1",
    padding: 24,
    borderRadius: 12,
  },
  header: {
    textAlign: "center",
    marginBottom: 24,
  },
  logoPrimary: {
    fontSize: 24,
    fontWeight: 700,
    color: "#6366F1",
  },
  logoSpark: {
    fontSize: 24,
    fontWeight: 700,
    color: "#06B6D4",
  },
  subtitle: {
    fontSize: 10,
    color: "#94A3B8",
    marginTop: 4,
  },
  title: {
    marginTop: 24,
    textAlign: "center",
  },
  titleText: {
    fontSize: 22,
    fontWeight: 600,
    color: "#F8FAFC",
  },
  body: {
    marginTop: 32,
    alignItems: "center",
    textAlign: "center",
  },
  label: {
    fontSize: 10,
    color: "#94A3B8",
  },
  name: {
    marginTop: 8,
    fontSize: 20,
    fontWeight: 600,
    color: "#F8FAFC",
  },
  course: {
    marginTop: 8,
    fontSize: 14,
    color: "#A78BFA",
  },
  footer: {
    marginTop: 40,
    flexDirection: "row",
    justifyContent: "space-between",
    fontSize: 10,
    color: "#94A3B8",
  },
  signatureBlock: {
    marginTop: 40,
    alignItems: "flex-end",
  },
  signatureLine: {
    width: 180,
    borderTopWidth: 1,
    borderTopColor: "#6366F1",
    marginTop: 24,
  },
  signatureLabel: {
    marginTop: 4,
    fontSize: 10,
    color: "#94A3B8",
  },
});

export function CertificatePDF({
  userName,
  courseName,
  dateString,
  certificateId,
}: CertificatePDFProps) {
  return (
    <Document>
      <Page size="A4" orientation="landscape" style={styles.page}>
        <View style={styles.border}>
          <View style={styles.header}>
            <Text>
              <Text style={styles.logoPrimary}>Ultima</Text>
              <Text style={styles.logoSpark}>Spark</Text>
              <Text style={styles.logoPrimary}> Academy</Text>
            </Text>
            <Text style={styles.subtitle}>
              Cosmic Indigo Spark Series • Certificate of Completion
            </Text>
          </View>

          <View style={styles.title}>
            <Text style={styles.titleText}>Certificate of Completion</Text>
          </View>

          <View style={styles.body}>
            <Text style={styles.label}>This certifies that</Text>
            <Text style={styles.name}>{userName}</Text>
            <Text style={styles.label}>has successfully completed</Text>
            <Text style={styles.course}>{courseName}</Text>
          </View>

          <View style={styles.footer}>
            <Text>Date: {dateString}</Text>
            <Text>Certificate ID: {certificateId}</Text>
          </View>

          <View style={styles.signatureBlock}>
            <View style={styles.signatureLine} />
            <Text style={styles.signatureLabel}>Director, UltimaSpark Academy</Text>
          </View>
        </View>
      </Page>
    </Document>
  );
}

