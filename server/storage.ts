import { users, receipts, printJobs, type User, type InsertUser, type Receipt, type InsertReceipt, type PrintJob, type InsertPrintJob } from "@shared/schema";

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Receipt methods
  createReceipt(receipt: InsertReceipt): Promise<Receipt>;
  getReceipt(id: number): Promise<Receipt | undefined>;
  getAllReceipts(): Promise<Receipt[]>;
  updateReceiptPrintStatus(id: number, printed: boolean): Promise<Receipt | undefined>;
  
  // Print job methods
  createPrintJob(printJob: InsertPrintJob): Promise<PrintJob>;
  getPrintJob(id: number): Promise<PrintJob | undefined>;
  getAllPrintJobs(): Promise<PrintJob[]>;
  updatePrintJobStatus(id: number, status: string, errorMessage?: string): Promise<PrintJob | undefined>;
  getPendingPrintJobs(): Promise<PrintJob[]>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private receipts: Map<number, Receipt>;
  private printJobs: Map<number, PrintJob>;
  private currentUserId: number;
  private currentReceiptId: number;
  private currentPrintJobId: number;

  constructor() {
    this.users = new Map();
    this.receipts = new Map();
    this.printJobs = new Map();
    this.currentUserId = 1;
    this.currentReceiptId = 1;
    this.currentPrintJobId = 1;
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async createReceipt(insertReceipt: InsertReceipt): Promise<Receipt> {
    const id = this.currentReceiptId++;
    const receipt: Receipt = {
      ...insertReceipt,
      id,
      date: new Date(),
      printed: false,
    };
    this.receipts.set(id, receipt);
    return receipt;
  }

  async getReceipt(id: number): Promise<Receipt | undefined> {
    return this.receipts.get(id);
  }

  async getAllReceipts(): Promise<Receipt[]> {
    return Array.from(this.receipts.values());
  }

  async updateReceiptPrintStatus(id: number, printed: boolean): Promise<Receipt | undefined> {
    const receipt = this.receipts.get(id);
    if (receipt) {
      const updatedReceipt = { ...receipt, printed };
      this.receipts.set(id, updatedReceipt);
      return updatedReceipt;
    }
    return undefined;
  }

  async createPrintJob(insertPrintJob: InsertPrintJob): Promise<PrintJob> {
    const id = this.currentPrintJobId++;
    const printJob: PrintJob = {
      ...insertPrintJob,
      id,
      createdAt: new Date(),
      completedAt: null,
    };
    this.printJobs.set(id, printJob);
    return printJob;
  }

  async getPrintJob(id: number): Promise<PrintJob | undefined> {
    return this.printJobs.get(id);
  }

  async getAllPrintJobs(): Promise<PrintJob[]> {
    return Array.from(this.printJobs.values());
  }

  async updatePrintJobStatus(id: number, status: string, errorMessage?: string): Promise<PrintJob | undefined> {
    const printJob = this.printJobs.get(id);
    if (printJob) {
      const updatedPrintJob = {
        ...printJob,
        status,
        errorMessage,
        completedAt: status === "completed" || status === "failed" ? new Date() : null,
      };
      this.printJobs.set(id, updatedPrintJob);
      return updatedPrintJob;
    }
    return undefined;
  }

  async getPendingPrintJobs(): Promise<PrintJob[]> {
    return Array.from(this.printJobs.values()).filter(
      (job) => job.status === "pending"
    );
  }
}

export const storage = new MemStorage();
