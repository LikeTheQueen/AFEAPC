import supabase from '../provider/supabase'

interface EmailResponse {
  success: boolean
  data: any
}

export interface AppEmailParams {
  subject: string;
  firstName: string;
  messageBody: string;
  supportContactName: string;
  fromAddress: string;
  toAddress?: string;      
  ctaUrl?: string;
  ctaUrlText?: string;         
}

export function buildAppEmailHTML(params: AppEmailParams): string {
  const {
    subject,
    firstName,
    messageBody,
    supportContactName,
    fromAddress,
    toAddress,
    ctaUrl = "https://afepartner.com",
    ctaUrlText = "Visit afepartner.com"
  } = params;

  return `
<!DOCTYPE html>
<html lang="en" style="margin:0; padding:0;">
<head>
  <meta charset="UTF-8" />
  <title>${subject}</title>
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
</head>

<body style="margin:0; padding:0; background:#f7f7f7; font-family: Montserrat, Arial, sans-serif;">

  <table width="100%" cellpadding="0" cellspacing="0" role="presentation">
    <tr>
      <td align="center" style="padding: 40px 0;">

        <table width="600" cellpadding="0" cellspacing="0" role="presentation" style="background:#ffffff; border-radius:8px; overflow:hidden;">

          <!-- Header -->
          <tr>
            <td style="background:#0E4749; padding:20px; text-align:center;">
              <h1 style="
                margin:0;
                color:#ffffff;
                font-size:24px;
                letter-spacing:1px;
                font-weight:600;
                text-transform: lowercase;
                font-variant: small-caps;
              ">
                ${subject}
              </h1>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding: 30px 40px; color:#333333; font-size:15px; line-height:1.6;">
              
              <p style="margin:0 0 15px 0; font-size:16px;">
                Hi ${firstName},
              </p>

              <p style="margin:0 0 25px 0;">
                ${messageBody}
              </p>

              <p style="margin:0 0 25px 0;">
                If you have any questions, feel free to reach out to ${supportContactName}.
              </p>

              <p style="margin:0;">
                Your digital AFE courier,<br/>
                ${fromAddress}
              </p>

            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background:#F6F6F6; padding:20px; text-align:center; font-size:13px; color:#666;">
              <p style="margin:0 0 8px 0;">
                <a href="${ctaUrl}" style="color:#F61067; text-decoration:none;">${ctaUrlText}</a>
              </p>
              ${
                toAddress
                  ? `<p style="margin:0; font-size:12px;">This message was sent to ${toAddress}.</p>`
                  : ""
              }
            </td>
          </tr>

        </table>

      </td>
    </tr>
  </table>

</body>
</html>
  `;
}

export const sendEmail = async (
  to: string,
  subject: string,
  html: string
): Promise<EmailResponse> => {
  try {
    const { data, error } = await supabase.functions.invoke<EmailResponse>('send_email_resend', {
      body: {
        to,
        subject,
        html,
      },
    })

    if (error) throw error
    
    console.log('Email sent:', data)
    return data as EmailResponse
  } catch (error) {
    console.error('Error sending email:', error)
    throw error
  }
}

export const handleSendEmail = async (
  subject: string, 
  message: string, 
  sendTo: string,
  sentFrom: string,
  sentFromfirstName: string,
  supportContact: string,   
  ctaUrl?: string, 
  ctaUrlText?: string
) => {
    
    const html = buildAppEmailHTML({
      subject: subject,
      firstName: sentFromfirstName,
      messageBody: message,
      supportContactName: supportContact,
      fromAddress: sentFrom,
      toAddress: sendTo,
      ctaUrl: ctaUrl,
      ctaUrlText: ctaUrlText
    });
    
    await sendEmail(
    sendTo,
    subject,
    html
  )
}