import type {Metadata} from 'next';
import { Inter } from 'next/font/google';
import './globals.css'; // Global styles

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
});

export const metadata: Metadata = {
  title: 'Soggiorno Track - Independent Permesso di Soggiorno Companion',
  description: 'The premium independent companion app for the Permesso di Soggiorno journey in Italy. Track status, prepare documents, access Italian immigration guides, and get expert help from Sofia AI.',
  keywords: ['permesso di soggiorno', 'italy immigration', 'track permesso', 'immigration companion', 'questura', 'post office kit', 'immigrant italy'],
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="en" className={`${inter.variable}`}>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var originalFetch = window.fetch;
                  var customFetch = originalFetch;
                  Object.defineProperty(window, 'fetch', {
                    get: function() {
                      return customFetch;
                    },
                    set: function(val) {
                      customFetch = val;
                    },
                    configurable: true,
                    enumerable: true
                  });
                } catch (e) {
                  console.warn('Soggiorno Track: Could not patch fetch property', e);
                }
              })();
            `
          }}
        />
      </head>
      <body className="font-sans antialiased bg-slate-50 text-slate-900" suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
