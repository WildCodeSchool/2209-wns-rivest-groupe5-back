export interface IEmailCreation {
  to: string;
  firstname: string;
  lastname: string;
  url: string;
  from: string;
  message?: string;

  send: (template: string, subject: string) => Promise<void>;
}
