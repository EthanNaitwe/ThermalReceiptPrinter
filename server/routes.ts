import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertReceiptSchema, insertPrintJobSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Receipt routes
  app.post("/api/receipts", async (req, res) => {
    try {
      const receiptData = insertReceiptSchema.parse(req.body);
      const receipt = await storage.createReceipt(receiptData);
      res.json(receipt);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid receipt data", errors: error.errors });
      } else {
        res.status(500).json({ message: "Failed to create receipt" });
      }
    }
  });

  app.get("/api/receipts", async (req, res) => {
    try {
      const receipts = await storage.getAllReceipts();
      res.json(receipts);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch receipts" });
    }
  });

  app.get("/api/receipts/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const receipt = await storage.getReceipt(id);
      if (!receipt) {
        res.status(404).json({ message: "Receipt not found" });
        return;
      }
      res.json(receipt);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch receipt" });
    }
  });

  // Print job routes
  app.post("/api/print", async (req, res) => {
    try {
      const { receiptId } = req.body;
      
      if (!receiptId) {
        res.status(400).json({ message: "Receipt ID is required" });
        return;
      }

      const receipt = await storage.getReceipt(receiptId);
      if (!receipt) {
        res.status(404).json({ message: "Receipt not found" });
        return;
      }

      const printJob = await storage.createPrintJob({
        receiptId,
        status: "pending",
      });

      // Simulate print processing
      setTimeout(async () => {
        const success = Math.random() > 0.2; // 80% success rate
        const status = success ? "completed" : "failed";
        const errorMessage = success ? undefined : "Printer connection failed";
        
        await storage.updatePrintJobStatus(printJob.id, status, errorMessage);
        if (success) {
          await storage.updateReceiptPrintStatus(receiptId, true);
        }
      }, 2000);

      res.json(printJob);
    } catch (error) {
      res.status(500).json({ message: "Failed to create print job" });
    }
  });

  app.post("/api/print/test", async (req, res) => {
    try {
      // Create a test print job
      const printJob = await storage.createPrintJob({
        receiptId: null,
        status: "pending",
      });

      // Simulate test print
      setTimeout(async () => {
        await storage.updatePrintJobStatus(printJob.id, "completed");
      }, 1000);

      res.json({ message: "Test print initiated", printJob });
    } catch (error) {
      res.status(500).json({ message: "Failed to initiate test print" });
    }
  });

  app.get("/api/print-jobs", async (req, res) => {
    try {
      const printJobs = await storage.getAllPrintJobs();
      res.json(printJobs);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch print jobs" });
    }
  });

  app.get("/api/print-jobs/pending", async (req, res) => {
    try {
      const pendingJobs = await storage.getPendingPrintJobs();
      res.json(pendingJobs);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch pending print jobs" });
    }
  });

  app.get("/api/print-jobs/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const printJob = await storage.getPrintJob(id);
      if (!printJob) {
        res.status(404).json({ message: "Print job not found" });
        return;
      }
      res.json(printJob);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch print job" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
