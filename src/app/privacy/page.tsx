import LegalPageLayout, {
  Section,
  Paragraph,
  BulletList,
  ContactBox,
} from "@/components/LegalPageLayout";

export default function PrivacyPage() {
  return (
    <LegalPageLayout
      type="privacy"
      title="Privacy Policy"
      lastUpdated="April 2, 2026"
    >
      <Section heading="1. Information We Collect">
        <Paragraph>
          We collect information you provide directly when you create an account
          and use NookNDen, including:
        </Paragraph>
        <BulletList
          items={[
            "Account information: name, email address, password, date of birth, and gender",
            "Property data: home inventory items, photos, serial numbers, warranty details, and maintenance records",
            "Usage data: how you interact with our platform, features you use, and pages you visit",
            "Device information: browser type, operating system, IP address, and device identifiers",
          ]}
        />
      </Section>

      <Section heading="2. How We Use Your Information">
        <Paragraph>We use the information we collect to:</Paragraph>
        <BulletList
          items={[
            "Provide, maintain, and improve NookNDen\u2019s services",
            "Create and manage your account",
            "Store and organize your home inventory data",
            "Send you service-related notifications and updates",
            "Respond to your questions and support requests",
            "Analyze usage patterns to improve our platform",
            "Protect against fraud and unauthorized access",
          ]}
        />
      </Section>

      <Section heading="3. Information Sharing">
        <Paragraph>
          We do not sell your personal information. We may share your information
          only in the following circumstances:
        </Paragraph>
        <BulletList
          items={[
            "With your explicit consent",
            "With service providers who assist in operating our platform (e.g., hosting, analytics)",
            "To comply with legal obligations, court orders, or governmental requests",
            "To protect the rights, safety, and property of NookNDen and our users",
            "In connection with a merger, acquisition, or sale of assets (with prior notice)",
          ]}
        />
      </Section>

      <Section heading="4. Data Security">
        <Paragraph>
          We implement industry-standard security measures to protect your
          information, including encryption of data in transit and at rest,
          secure authentication protocols, and regular security audits.
        </Paragraph>
        <Paragraph>
          However, no method of transmission over the Internet or electronic
          storage is 100% secure. While we strive to protect your personal
          information, we cannot guarantee its absolute security.
        </Paragraph>
      </Section>

      <Section heading="5. Data Retention">
        <Paragraph>
          We retain your personal information for as long as your account is
          active or as needed to provide you services. You may request deletion
          of your account and associated data at any time.
        </Paragraph>
        <Paragraph>
          Upon account deletion, we will remove your personal data within 30
          days, except where retention is required by law or for legitimate
          business purposes (e.g., resolving disputes, enforcing agreements).
        </Paragraph>
      </Section>

      <Section heading="6. Your Rights">
        <Paragraph>
          Depending on your location, you may have the following rights
          regarding your personal data:
        </Paragraph>
        <BulletList
          items={[
            "Access: Request a copy of your personal data",
            "Correction: Update or correct inaccurate information",
            "Deletion: Request deletion of your personal data",
            "Portability: Receive your data in a structured, machine-readable format",
            "Objection: Object to certain processing of your data",
            "Restriction: Request restricted processing in certain circumstances",
          ]}
        />
        <Paragraph>
          To exercise any of these rights, contact us at the information
          provided below.
        </Paragraph>
      </Section>

      <Section heading="7. Children\u2019s Privacy">
        <Paragraph>
          NookNDen is not intended for children under 13 years of age. We do not
          knowingly collect personal information from children under 13. If we
          become aware that we have collected information from a child under 13,
          we will take steps to delete that information promptly.
        </Paragraph>
      </Section>

      <Section heading="8. Third-Party Links">
        <Paragraph>
          Our service may contain links to third-party websites or services. We
          are not responsible for the privacy practices of those third parties.
          We encourage you to read the privacy policies of any third-party
          services you visit.
        </Paragraph>
      </Section>

      <Section heading="9. Changes to This Policy">
        <Paragraph>
          We may update this Privacy Policy from time to time. We will notify you
          of any material changes by posting the updated policy on our website
          and updating the &ldquo;Last updated&rdquo; date. Your continued use
          of NookNDen after changes are posted constitutes your acceptance of the
          revised policy.
        </Paragraph>
      </Section>

      <Section heading="10. Contact Us">
        <Paragraph>
          If you have any questions about this Privacy Policy or our data
          practices, please contact us at:
        </Paragraph>
        <ContactBox>
          <p>
            <strong>Email:</strong> privacy@nooknden.com
          </p>
          <p>
            <strong>Address:</strong> NookNDen Privacy Team
          </p>
          <p>3434 S. Grand Avenue, 3rd Floor</p>
          <p>Los Angeles, CA 90007</p>
        </ContactBox>
      </Section>
    </LegalPageLayout>
  );
}
