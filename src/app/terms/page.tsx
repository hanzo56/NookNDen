import LegalPageLayout, {
  Section,
  Paragraph,
  BulletList,
  ContactBox,
} from "@/components/LegalPageLayout";

export default function TermsPage() {
  return (
    <LegalPageLayout
      type="terms"
      title="Terms of Service"
      lastUpdated="April 2, 2026"
    >
      <Section heading="1. Acceptance of Terms">
        <Paragraph>
          Welcome to NookNDen. By accessing or using our home inventory
          management platform, you agree to be bound by these Terms of Service
          (&ldquo;Terms&rdquo;). If you do not agree to these Terms, please do
          not use our service.
        </Paragraph>
        <Paragraph>
          NookNDen provides a digital platform for homeowners to track, organize,
          and manage information about their residential properties, including
          inventory, maintenance records, warranties, and documentation.
        </Paragraph>
      </Section>

      <Section heading="2. User Accounts">
        <Paragraph>
          To use NookNDen, you must create an account by providing accurate,
          current, and complete information. You are responsible for:
        </Paragraph>
        <BulletList
          items={[
            "Maintaining the confidentiality of your account credentials",
            "All activities that occur under your account",
            "Notifying us immediately of any unauthorized access or security breach",
            "Ensuring you are at least 18 years of age or have parental consent",
          ]}
        />
      </Section>

      <Section heading="3. Acceptable Use">
        <Paragraph>
          You agree to use NookNDen only for lawful purposes. You may not:
        </Paragraph>
        <BulletList
          items={[
            "Upload malicious code, viruses, or harmful content",
            "Attempt to gain unauthorized access to our systems or other users\u2019 accounts",
            "Use the service for any illegal or fraudulent activities",
            "Violate any applicable laws or regulations",
            "Harass, abuse, or harm other users",
            "Upload content that infringes on intellectual property rights",
          ]}
        />
      </Section>

      <Section heading="4. Content and Data">
        <Paragraph>
          <strong className="text-[#0f172b]">Your Content:</strong> You retain
          all ownership rights to the content you upload to NookNDen, including
          photos, documents, and information about your property. By uploading
          content, you grant us a limited license to store, process, and display
          your content solely to provide our services to you.
        </Paragraph>
        <Paragraph>
          <strong className="text-[#0f172b]">Data Accuracy:</strong> While we
          strive to provide accurate tools and features, you are responsible for
          the accuracy of the information you enter into the platform.
        </Paragraph>
        <Paragraph>
          <strong className="text-[#0f172b]">Backup:</strong> We recommend
          maintaining backup copies of important documents and information stored
          on NookNDen.
        </Paragraph>
      </Section>

      <Section heading="5. Intellectual Property">
        <Paragraph>
          The NookNDen platform, including its design, features, software, and
          content (excluding user-generated content), is owned by us and
          protected by copyright, trademark, and other intellectual property
          laws.
        </Paragraph>
        <Paragraph>
          You may not copy, modify, distribute, sell, or lease any part of our
          services without our express written permission.
        </Paragraph>
      </Section>

      <Section heading="6. Service Availability">
        <Paragraph>
          We strive to provide reliable and continuous service, but we do not
          guarantee that NookNDen will be available at all times or be error-free.
          We may:
        </Paragraph>
        <BulletList
          items={[
            "Modify, suspend, or discontinue any part of the service",
            "Perform maintenance and updates that may temporarily interrupt service",
            "Change features or pricing with reasonable notice",
          ]}
        />
      </Section>

      <Section heading="7. Disclaimer of Warranties">
        <Paragraph>
          NOOKNDEN IS PROVIDED &ldquo;AS IS&rdquo; AND &ldquo;AS
          AVAILABLE&rdquo; WITHOUT WARRANTIES OF ANY KIND, EITHER EXPRESS OR
          IMPLIED, INCLUDING BUT NOT LIMITED TO WARRANTIES OF MERCHANTABILITY,
          FITNESS FOR A PARTICULAR PURPOSE, OR NON-INFRINGEMENT.
        </Paragraph>
        <Paragraph>
          We do not warrant that the service will meet your requirements or that
          it will be uninterrupted, secure, or error-free.
        </Paragraph>
      </Section>

      <Section heading="8. Limitation of Liability">
        <Paragraph>
          TO THE MAXIMUM EXTENT PERMITTED BY LAW, NOOKNDEN SHALL NOT BE LIABLE
          FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE
          DAMAGES, OR ANY LOSS OF PROFITS OR REVENUES, WHETHER INCURRED DIRECTLY
          OR INDIRECTLY, OR ANY LOSS OF DATA, USE, GOODWILL, OR OTHER INTANGIBLE
          LOSSES.
        </Paragraph>
        <Paragraph>
          Our total liability for any claims related to the service shall not
          exceed the amount you paid us in the twelve months preceding the claim.
        </Paragraph>
      </Section>

      <Section heading="9. Termination">
        <Paragraph>
          You may terminate your account at any time by contacting us or using
          the account deletion feature in your profile settings.
        </Paragraph>
        <Paragraph>
          We reserve the right to suspend or terminate your account if you
          violate these Terms or engage in conduct that we determine to be
          harmful to other users or our service.
        </Paragraph>
      </Section>

      <Section heading="10. Changes to Terms">
        <Paragraph>
          We may update these Terms from time to time. If we make material
          changes, we will notify you by email or through the service. Your
          continued use of NookNDen after such changes constitutes your
          acceptance of the updated Terms.
        </Paragraph>
      </Section>

      <Section heading="11. Contact Us">
        <Paragraph>
          If you have any questions about these Terms, please contact us at:
        </Paragraph>
        <ContactBox>
          <p>
            <strong>Email:</strong> legal@nooknden.com
          </p>
          <p>
            <strong>Address:</strong> NookNDen Legal Department
          </p>
          <p>3434 S. Grand Avenue, 3rd Floor</p>
          <p>Los Angeles, CA 90007</p>
        </ContactBox>
      </Section>
    </LegalPageLayout>
  );
}
