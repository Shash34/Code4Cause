"use client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import React, { useState } from "react";

async function fetchMusicData(musicLink: string) {
  const response = await fetch(`https://api.cynanite.com/analyze`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ url: musicLink }),
  });

  if (!response.ok) {
    throw new Error(`API error: ${response.status}`);
  }

  return response.json();
}

export function MusicInput() {
  const [musicLink, setMusicLink] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<Record<string, unknown> | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async () => {
    if (!musicLink) return;
    setLoading(true);
    setResult(null);
    setError(null);
    try {
      const data = await fetchMusicData(musicLink);
      setResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Input Music Link</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Rate My Tune</DialogTitle>
          <DialogDescription>
            Paste a YouTube link below and we&apos;ll analyze whether it&apos;s
            good for studying.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="music-link" className="text-right">
              Link
            </Label>
            <Input
              id="music-link"
              value={musicLink}
              className="col-span-3"
              placeholder="https://youtube.com/watch?v=..."
              onChange={(e) => setMusicLink(e.target.value)}
            />
          </div>

          {loading && (
            <p className="text-sm text-center text-muted-foreground">
              Analyzing your track...
            </p>
          )}

          {error && (
            <p className="text-sm text-center text-red-500">{error}</p>
          )}

          {result && (
            <div className="rounded-md border p-4 space-y-2 text-sm">
              {Object.entries(result).map(([key, value]) => (
                <div key={key} className="flex justify-between gap-4">
                  <span className="font-medium capitalize">
                    {key.replace(/_/g, " ")}
                  </span>
                  <span className="text-muted-foreground text-right">
                    {String(value)}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        <DialogFooter>
          <Button
            type="button"
            onClick={handleSubmit}
            disabled={loading || !musicLink}
          >
            {loading ? "Analyzing..." : "Rate My Tune"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
