import { SESClient, SendEmailCommand } from "@aws-sdk/client-ses";

const sesClient = new SESClient({
  region: `${process.env.SES_REGION}`,
  credentials: {
    accessKeyId: `${process.env.SES_KEY_ID}`,
    secretAccessKey: `${process.env.SES_SECRET_ACCESS_KEY}`,
  },
});

interface IData {
  type: string;
  protocol: string;
  toAddress: string; 
  host: string;
}

export async function sendEmail(data: IData): Promise<any> {
  try {
    const createSendEmailCommand = (toAddress: string, fromAddress: string) => {
      return new SendEmailCommand({
        Destination: {
          CcAddresses: [],
          ToAddresses: [toAddress],
        },
        Message: {
          Body: {
            Html: {
              Charset: "UTF-8",
              Data: `
                <h1>Nova denúncia de ${data.type}</strong>.</h1>
                <p>Uma nova denúnica de ${data.type} foi recebida no sistema.</p>
                <p>Para acessar o conteúdo da denúncia acesse: <a href="${data.host}/acompanhar" target="_blank" rel="noopener noreferrer">Ver denúncia</a>, fornecendo o número de protocolo ${data.protocol}</p>
                `,
            },
            Text: {
              Charset: "UTF-8",
              Data: `
              Nova deúncia de ${data.type}
              
              Uma nova ednúnica de ${data.type} foi recebida no sistema.
              Para acessar o conteúdo da denúncia acesse: ${data.host}/acompanhar, fornecendo o número de protocolo ${data.protocol}
              `,
            },
          },
          Subject: {
            Charset: "UTF-8",
            Data: `Nova denúncia ${data.type}`,
          },
        },
        Source: fromAddress,
        ReplyToAddresses: [],
      });
    };

    let sendEmailCommand = createSendEmailCommand(data.toAddress, `${process.env.SES_SENDER_EMAIL}`);

    sesClient
      .send(sendEmailCommand)
      .then((result) => {
        console.log(result);
        return result;
      })
      .catch((error) => {
        console.log("Error", error);
        throw error;
      });
  } catch (err) {
    console.log(err);
    throw err;
  }
}
