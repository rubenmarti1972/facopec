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

      // Check if email plugin is available
      if (!strapi.plugins?.email?.services?.email) {
        strapi.log.error('Email plugin is not available or not properly configured');

        // Log email details for debugging in development
        if (process.env.NODE_ENV === 'development') {
          strapi.log.warn('Email would have been sent:', { to, subject, replyTo });
        }

        return ctx.badRequest({
          success: false,
          message: 'Email service is not configured. Please contact the administrator.',
          error: 'SMTP_NOT_CONFIGURED'
        });
      }

      // Check if SMTP credentials are configured
      const hasSmtpUser = !!process.env.BREVO_SMTP_USER;
      const hasSmtpKey = !!process.env.BREVO_SMTP_KEY;

      if (!hasSmtpUser || !hasSmtpKey) {
        strapi.log.error('SMTP credentials are not configured in environment variables');

        // Log email details for debugging
        strapi.log.warn('Email details (not sent):', {
          to,
          subject,
          replyTo,
          reason: 'Missing SMTP credentials (BREVO_SMTP_USER or BREVO_SMTP_KEY)'
        });

        return ctx.badRequest({
          success: false,
          message: 'Email service is not fully configured. Please contact the administrator.',
          error: 'SMTP_CREDENTIALS_MISSING',
          details: process.env.NODE_ENV === 'development' ? {
            hasSmtpUser,
            hasSmtpKey
          } : undefined
        });
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
