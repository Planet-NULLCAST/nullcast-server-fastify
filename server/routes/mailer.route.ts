import { RouteOptions } from 'fastify';
import { FastifyInstance } from 'fastify/types/instance';
import { SendMailOptions } from 'nodemailer';
import mailer from 'lib/mailer';
import { issueToken } from 'utils/jwt.utils';

import { mailerHealthSchema, forgotPassSchema } from 'route-schemas/mailer/mailer.schema';

const mailerHealth: RouteOptions = {
  method: 'GET',
  url: '/send',
  schema: mailerHealthSchema,
  handler: async(_, response) => {
    const sender = await mailer.sendMail({
      from: 'Nullcast <connect@nullcast.io>',
      to: 'ashwin.chandran@neoito.com',
      subject: 'example',
      text: 'hi nullcast user'
    });
    if (sender) {
      response.send({message: 'Message sent'});
    }
  }

};

const forgotPass: RouteOptions = {
  method: 'POST',
  url: '/recovery',
  schema: forgotPassSchema,
  handler: async(request, reply) => {
    try {
      const { to: userMail } = request.body as SendMailOptions;
      const resetToken = issueToken({email: userMail});
      const sender = await mailer.sendMail({
        from: 'Nullcast <connect@nullcast.io>',
        to: userMail,
        subject: 'Password Reset',
        // eslint-disable-next-line max-len
        text: `hi nullcast user, here is your password reset link: ${process.env.CLIENT_URL}/reset-password?token=${resetToken}`
      });

      if (sender) {
        reply.code(200).send({ message: `Email sent to ${userMail}` });
      } else {
        reply.code(500).send({ message: 'Sender Error' });
      }
    } catch (error) {
      throw error;
    }
  }

};

function mailerPath(server: FastifyInstance, _: any, done: () => void) {

  server.route(forgotPass);
  server.route(mailerHealth);
  done();
}

export default mailerPath;
