import { Html, Head, Main, NextScript } from "next/document";
import Script from "next/script";

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <meta charSet="utf-8" />
        <meta name="description" content="ZK & Smart Contract Security" />
        <meta
          name="keywords"
          content="yAudit, Zero Knowledge, Smart Contract Security, Blockchain Security, Ethereum, Cryptography, DeFi"
        />
        <meta name="referrer" content="origin" />
        <meta name="creator" content="yAudit Team" />
        <meta name="robots" content="follow, index" />

        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://research.yaudit.dev" />
        <meta property="og:title" content="yAudit" />
        <meta
          property="og:description"
          content="ZK & Smart Contract Security"
        />
        <meta property="og:site_name" content="yAudit" />
        <meta
          property="og:image"
          content="https://yaudit.dev/twitter.png"
        />

        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@yaudit" />
        <meta name="twitter:creator" content="@yaudit" />
        <meta name="twitter:image" content="https://yaudit.dev/twitter.png" />

        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/icon.png" type="image/png" sizes="512x512" />
        <link rel="apple-touch-icon" href="/icon.png" />
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.css"
          integrity="sha384-n8MVd4RsNIU0tAv4ct0nTaAbDJwPJzDEaqSD1odI+WdtXRGWt2kTvGFasHpSy3SV"
          crossOrigin="anonymous"
        />
      </Head>
      <body>
        <Main />
        <NextScript />

        <Script
          strategy="afterInteractive"
          src="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/highlight.min.js"
        />
        <Script
          strategy="afterInteractive"
          src="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/languages/solidity.min.js"
        />

        {/* Initialize highlight.js after libraries are loaded */}
        <Script id="highlight-init" strategy="afterInteractive">
          {`
            window.onload = function() {
              // Initialize syntax highlighting
              hljs.highlightAll();

              // Make hljs available globally
              window.hljs = hljs;
            }
          `}
          </Script>
{/* Initialize mermaid with safe DOM handling */}
<Script
  strategy="afterInteractive"
  src="https://cdn.jsdelivr.net/npm/mermaid@11.11.0/dist/mermaid.min.js"
/>

<Script id="mermaid-config" strategy="afterInteractive">
  {`
    // Wait for both DOM and mermaid to be ready
    function initializeMermaid() {
      if (typeof mermaid === 'undefined' || typeof document === 'undefined') {
        setTimeout(initializeMermaid, 100);
        return;
      }

      // Light theme configuration for better readability
      const config = {
        startOnLoad: false,
        theme: 'base',
        suppressErrorRendering: true,
        logLevel: 'error',
        errorConfig: {
          errorMessage: '',
          errorRenderer: () => '',
        },
        flowchart: {
          htmlLabels: true,
          curve: 'basis',
          padding: 15,
          nodeSpacing: 50,
          rankSpacing: 50,
          useMaxWidth: true
        },
        themeVariables: {
          primaryColor: '#f8fafc',
          primaryTextColor: '#1e293b',
          primaryBorderColor: '#64748b',
          lineColor: '#64748b',
          secondaryColor: '#e2e8f0',
          tertiaryColor: '#cbd5e1',
          background: '#ffffff',
          mainBkg: '#f8fafc',
          secondBkg: '#e2e8f0',
          tertiaryBkg: '#cbd5e1',
          fontFamily: 'Arial, sans-serif',
          fontSize: '16px',
          darkMode: false,
          // Node styling
          nodeBkg: '#f8fafc',
          nodeBorder: '#64748b',
          clusterBkg: '#f1f5f9',
          clusterBorder: '#94a3b8',
          // Edge styling
          edgeLabelBackground: '#ffffff',
          // Flowchart specific
          flowchartNodeBkg: '#f8fafc',
          flowchartNodeBorder: '#64748b',
          // Sequence diagram
          actorBkg: '#f8fafc',
          actorBorder: '#64748b',
          actorTextColor: '#1e293b',
          actorLineColor: '#64748b',
          signalColor: '#64748b',
          signalTextColor: '#1e293b',
          activationBkgColor: '#e2e8f0',
          activationBorderColor: '#64748b',
          // Pie chart
          pie1: '#f8fafc',
          pie2: '#e2e8f0',
          pie3: '#cbd5e1',
          pie4: '#94a3b8',
          pieOuterStrokeWidth: '2px',
          pieStrokeColor: '#64748b',
          pieSectionTextColor: '#1e293b',
          pieTitleTextSize: '25px',
          pieTitleTextColor: '#1e293b',
          pieLegendTextSize: '18px',
          pieLegendTextColor: '#1e293b'
        }
      };

      let initialized = false;

      // Safe mermaid initialization
      window.initMermaid = function() {
        try {
          if (!initialized && typeof mermaid !== 'undefined') {
            mermaid.initialize(config);
            initialized = true;
          }

          // Process mermaid diagrams
          setTimeout(() => {
            const elements = document.querySelectorAll('.mermaid:not([data-processed])');
            elements.forEach((element, index) => {
              if (element.textContent && element.textContent.trim()) {
                const id = 'mermaid-' + Date.now() + '-' + index;
                element.setAttribute('data-processed', 'true');
                
                // Use the original diagram source
                let diagramSource = element.textContent.trim();
                
                try {
                  mermaid.render(id, diagramSource).then((result) => {
                    element.innerHTML = result.svg;
                    
                    // Clean up any error notifications that might have been added to DOM
                    setTimeout(() => {
                      const errorElements = document.querySelectorAll('[id*="mermaidError"], .mermaid-error-message, .error');
                      errorElements.forEach(errorEl => {
                        if (errorEl.textContent && errorEl.textContent.includes('syntax error')) {
                          errorEl.remove();
                        }
                      });
                      
                      const svg = element.querySelector('svg');
                      if (svg) {
                        // Set explicit styles to override any mermaid defaults
                        svg.style.maxWidth = '100%';
                        svg.style.maxHeight = '55vh';
                        svg.style.height = 'auto';
                        svg.style.width = 'auto';
                      }
                    }, 10);
                  }).catch((error) => {
                    // Silently handle errors - don't show error messages to users
                    console.warn('Mermaid render error (suppressed):', error);
                    // Only show error if diagram completely fails to render
                    if (!element.querySelector('svg')) {
                      element.innerHTML = '<div class="mermaid-error">Diagram unavailable</div>';
                    }
                  });
                } catch (error) {
                  // Silently handle errors
                  console.warn('Mermaid process error (suppressed):', error);
                  if (!element.querySelector('svg')) {
                    element.innerHTML = '<div class="mermaid-error">Diagram unavailable</div>';
                  }
                }
              }
            });
          }, 50);
        } catch (error) {
          console.warn('Mermaid initialization error:', error);
        }
      };

      // Initialize immediately
      window.initMermaid();
      
      // Global cleanup for mermaid error notifications
      const cleanupErrorNotifications = () => {
        setTimeout(() => {
          const errorElements = document.querySelectorAll(
            '[id*="mermaidError"], [class*="mermaidError"], [id*="error"], .error, [role="alert"]'
          );
          errorElements.forEach(errorEl => {
            if (errorEl.textContent && 
                (errorEl.textContent.includes('syntax error') || 
                 errorEl.textContent.includes('Parse error') ||
                 errorEl.textContent.includes('mermaid'))) {
              errorEl.style.display = 'none';
              errorEl.remove();
            }
          });
        }, 100);
      };
      
      // Run cleanup periodically
      setInterval(cleanupErrorNotifications, 1000);
      window.cleanupMermaidErrors = cleanupErrorNotifications;
    }

    // Start initialization
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', initializeMermaid);
    } else {
      initializeMermaid();
    }
  `}
</Script>
        <Script
          strategy="afterInteractive"
          src="https://www.googletagmanager.com/gtag/js?id="
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());

            gtag('config', 'G-E6FXP89314');
          `}
        </Script>
      </body>
    </Html>
  );
}
