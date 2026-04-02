import LegalPageLayout, {
  Section,
  Paragraph,
  BulletList,
  ContactBox,
} from "@/components/LegalPageLayout";

export default function CookiesPage() {
  return (
    <LegalPageLayout
      type="cookies"
      title="Cookies Policy"
      lastUpdated="April 2, 2026"
    >
      <Section heading="1. What Are Cookies">
        <Paragraph>
          Cookies are small text files placed on your device when you visit a
          website. They are widely used to make websites work more efficiently
          and to provide information to site owners. NookNDen uses cookies and
          similar technologies to enhance your experience on our platform.
        </Paragraph>
      </Section>

      <Section heading="2. Types of Cookies We Use">
        <Paragraph>
          <strong className="text-[#0f172b]">Essential Cookies:</strong> These
          cookies are necessary for the platform to function properly. They
          enable core features such as authentication, session management, and
          security. You cannot opt out of essential cookies.
        </Paragraph>
        <Paragraph>
          <strong className="text-[#0f172b]">Performance Cookies:</strong> These
          cookies help us understand how visitors interact with NookNDen by
          collecting anonymous usage data. This information helps us improve the
          platform&apos;s performance and user experience.
        </Paragraph>
        <Paragraph>
          <strong className="text-[#0f172b]">Functional Cookies:</strong> These
          cookies remember your preferences and settings (such as language,
          region, or display options) to provide a more personalized experience.
        </Paragraph>
        <Paragraph>
          <strong className="text-[#0f172b]">Analytics Cookies:</strong> We use
          analytics cookies to gather insights about how our platform is used,
          which pages are most popular, and where users encounter issues. This
          data is aggregated and anonymized.
        </Paragraph>
      </Section>

      <Section heading="3. Cookies We Use">
        <Paragraph>Specifically, NookNDen uses cookies for:</Paragraph>
        <BulletList
          items={[
            "Authentication: Keeping you signed in during your session",
            "Security: Protecting your account from unauthorized access and CSRF attacks",
            "Preferences: Remembering your settings and display preferences",
            "Analytics: Understanding usage patterns to improve our service",
            "Session management: Maintaining your session state across page navigations",
          ]}
        />
      </Section>

      <Section heading="4. Third-Party Cookies">
        <Paragraph>
          Some cookies on our platform are set by third-party services we use,
          such as analytics providers and hosting services. These third parties
          may use cookies to collect information about your online activities
          across different websites.
        </Paragraph>
        <Paragraph>
          We do not control third-party cookies and recommend reviewing the
          privacy policies of these services for more information about their
          cookie practices.
        </Paragraph>
      </Section>

      <Section heading="5. Managing Cookies">
        <Paragraph>
          You can control and manage cookies through your browser settings. Most
          browsers allow you to:
        </Paragraph>
        <BulletList
          items={[
            "View what cookies are stored on your device",
            "Delete all or specific cookies",
            "Block cookies from specific sites or all sites",
            "Set preferences for cookie acceptance",
          ]}
        />
        <Paragraph>
          Please note that blocking or deleting essential cookies may affect the
          functionality of NookNDen and prevent you from using certain features.
        </Paragraph>
      </Section>

      <Section heading="6. How Long Do Cookies Last">
        <Paragraph>
          <strong className="text-[#0f172b]">Session Cookies:</strong> These are
          temporary cookies that are deleted when you close your browser. They
          are used to maintain your session while you use our platform.
        </Paragraph>
        <Paragraph>
          <strong className="text-[#0f172b]">Persistent Cookies:</strong> These
          cookies remain on your device for a set period (typically 30 days to 1
          year) or until you manually delete them. They are used to remember your
          preferences and recognize you on return visits.
        </Paragraph>
      </Section>

      <Section heading="7. Updates to This Policy">
        <Paragraph>
          We may update this Cookies Policy from time to time to reflect changes
          in technology, legislation, or our data practices. We will post the
          updated policy on our website and update the &ldquo;Last
          updated&rdquo; date at the top of this page.
        </Paragraph>
      </Section>

      <Section heading="8. Contact Us">
        <Paragraph>
          If you have any questions about our use of cookies, please contact us
          at:
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
