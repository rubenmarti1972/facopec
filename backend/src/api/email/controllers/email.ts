/**
 * Email controller for FACOPEC
 * Handles sending emails from contact forms, partnership requests, etc.
 */

export default {
  async send(ctx) {
    try {
      const { to, subject, html, text, replyTo } = ctx.request.body;

      // Validate required fields
      if (!to || !subject || (!html && !text)) {
        return ctx.badRequest('Missing required fields: to, subject, and html or text');
      }

      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(to)) {
        return ctx.badRequest('Invalid email format for "to" field');
      }

      if (replyTo && !emailRegex.test(replyTo)) {
        return ctx.badRequest('Invalid email format for "replyTo" field');
      }

      // Send email using Strapi's email plugin
      await strapi.plugins['email'].services.email.send({
        to,
        from: process.env.SMTP_DEFAULT_FROM || 'notificaciones.facopec@gmail.com',
        replyTo: replyTo || process.env.SMTP_DEFAULT_REPLY_TO || 'profeencasasedeciudaddelsur@gmail.com',
        subject,
        text: text || '',
        html: html || text,
      });

      // Log successful email send
      strapi.log.info(`Email sent successfully to ${to} with subject: ${subject}`);

      return ctx.send({
        success: true,
        message: 'Email sent successfully',
        to,
        subject
      });
    } catch (error) {
      strapi.log.error('Error sending email:', error);

      // Return detailed error in development, generic in production
      const isDev = process.env.NODE_ENV === 'development';

      return ctx.internalServerError(
        isDev
          ? `Failed to send email: ${error.message}`
          : 'Failed to send email. Please try again later.'
      );
    }
  },
};
