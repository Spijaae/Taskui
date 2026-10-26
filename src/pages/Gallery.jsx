import { motion, useReducedMotion, AnimatePresence } from "framer-motion";
import { Sparkles, LoaderCircle, X as XIcon } from "lucide-react";
import React from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { AppSidebar } from "@/components/AppSidebar";
import { useMobileNav } from "@/components/MobileNavProvider";
import { MobileSegmented } from "@/components/MobileSegmented";
import { MobileTopBar } from "@/components/MobileTopBar";
import { useSearchPalette } from "@/components/SearchPalette";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { useI18n } from "@/i18n";
import { supabase } from "@/integrations/supabase/client";
import {
  iconCircle,
  iconGrid as iconGridImported,
  iconMenu,
  iconSearchLarge,
  iconStar,
  iconStarOutline,
  iconChevronLeft,
} from "@/lib/appIcons";
import { splitTitle } from "@/lib/memories";
import { springSnappy, springPop, popInVariants, fadeQuick } from "@/lib/motion";
import { cn } from "@/lib/utils";

function Fe(t) {
  return String(t ?? "")
    .trim()
    .toLowerCase()
    .replace(/\s+/g, " ");
}
function Lt(t) {
  const s = Fe(t.vaultName);
  return {
    memories: t.drafts.map((r) => {
      const tags = [];
      for (const i of [s, "photo", ...(r.tags ?? [])]) {
        const n = Fe(i);
        if (n && !tags.includes(n)) {
          tags.push(n);
        }
      }
      const a = String(r.caption ?? "").trim();
      return {
        user_id: t.userId,
        content: a || `Photo in ${t.vaultName}`,
        type: "photo",
        tags,
        timestamp: t.nowIso,
        metadata: {
          attachments: [
            {
              url: r.url,
              type: r.fileType,
            },
          ],
          source: "gallery-import",
          vault_id: t.vaultId,
          gallery_image_id: r.galleryImageId,
        },
      };
    }),
  };
}
function Tt(memory_id, s) {
  return {
    memory_id,
    file_url: s.url,
    file_type: s.fileType || null,
    file_size: null,
    transcription: null,
  };
}
function Rt(t) {
  return {
    vault_id: t.vaultId,
    user_id: t.userId,
    memory_id: t.memoryId,
    sort_order: t.index,
  };
}
function Dt(t, s) {
  const fresh = (t ?? []).filter((r) => !s.has(r.galleryImageId));
  return {
    fresh,
    duplicates: (t ?? []).length - fresh.length,
  };
}
const Ie = 25 * 1024 * 1024;
const qe = {
  width: 200,
  height: 200,
};
const Ft = [".jpg", ".jpeg", ".png", ".gif", ".webp", ".bmp", ".heic", ".heif", ".avif", ".tif", ".tiff"];
function validate(t) {
  const s = String(t?.name ?? "").toLowerCase();
  const o = String(t?.type ?? "").toLowerCase();
  if (o.startsWith("image/") || (!o && Ft.some((l) => s.endsWith(l)))) {
    if (Number(t?.size ?? 0) > Ie) {
      return `Too large — images must be under ${Math.round(Ie / (1024 * 1024))} MB.`;
    }
    return null;
  }
  return "Only image files can be added to the gallery.";
}
function $t(t, name, o) {
  const r = String(name ?? "");
  const l = r.lastIndexOf(".");
  const a =
    l > 0
      ? r
          .slice(l + 1)
          .toLowerCase()
          .replace(/[^a-z0-9]/g, "")
      : "";
  const n =
    (l > 0 ? r.slice(0, l) : r)
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 60) || "photo";
  return `${t}/${o}-${n}${a ? `.${a}` : ""}`;
}
function Bt(t) {
  const s = String(t ?? "").toLowerCase();
  const o = s.lastIndexOf(".");
  const r = o > 0 ? s.slice(o + 1) : "";
  return (
    {
      jpg: "image/jpeg",
      jpeg: "image/jpeg",
      png: "image/png",
      gif: "image/gif",
      webp: "image/webp",
      bmp: "image/bmp",
      heic: "image/heic",
      heif: "image/heif",
      avif: "image/avif",
      tif: "image/tiff",
      tiff: "image/tiff",
    }[r] ?? "image/*"
  );
}
function Et(width, height, o = 200) {
  const r = Number(width);
  const l = Number(height);
  if (!Number.isFinite(r) || !Number.isFinite(l) || r <= 0 || l <= 0) {
    return qe;
  }
  const a = r / l;
  if (a >= 1) {
    return {
      width: o,
      height: Math.round(o / a),
    };
  }
  return {
    width: Math.round(o * a),
    height: o,
  };
}
function Ot(t, s) {
  const o = s.timeoutMs ?? 5000;
  return new Promise((resolve) => {
    let l = false;
    const a = s.create();
    const i = (g) => {
      if (!l) {
        l = true;
        clearTimeout(n);
        a.onload = null;
        a.onerror = null;
        resolve(g);
      }
    };
    const n = setTimeout(() => i(null), o);
    a.onload = () => {
      const width = Number(a.width);
      const height = Number(a.height);
      const N = Number.isFinite(width) && Number.isFinite(height) && width > 0 && height > 0;
      i(
        N
          ? {
              width,
              height,
            }
          : null,
      );
    };
    a.onerror = () => i(null);
    a.src = t;
  });
}
function UtComponent({ open, onOpenChange, photos, onSaved }) {
  const { t: t_1 } = useI18n();
  const [a, setA] = React.useState([]);
  const [n, setN] = React.useState("new");
  const [m, setM] = React.useState("");
  const [_, set_] = React.useState({});
  const [h, setH] = React.useState(false);
  const [w, setW] = React.useState(false);
  const C = React.useMemo(() => photos.map((f) => f.id).join(","), [photos]);
  React.useEffect(() => {
    if (open) {
      set_({});
      setN("new");
      setM("");
      (async () => {
        const {
          data: { user },
        } = await supabase.auth.getUser();
        if (!user) {
          return;
        }
        const { data } = await supabase.from("vaults").select("id, name").eq("user_id", user.id).order("name", {
          ascending: true,
        });
        setA(data ?? []);
      })();
    }
  }, [open]);
  React.useEffect(() => {
    if (!open || photos.length === 0) {
      return;
    }
    let f = false;
    setH(true);
    (async () => {
      for (const j of photos) {
        if (f) {
          break;
        }
        try {
          const { data, error } = await supabase.functions.invoke("analyse-photo", {
            body: {
              imageUrl: j.url,
            },
          });
          if (error || f) {
            continue;
          }
          set_((u) => ({
            ...u,
            [j.id]: u[j.id] ?? {
              caption: String(data?.caption ?? ""),
              tags: (Array.isArray(data?.tags) ? data.tags : []).join(", "),
            },
          }));
        } catch {}
      }
      if (!f) {
        setH(false);
      }
    })();
    return () => {
      f = true;
    };
  }, [open, C]);
  const O = (f, j) =>
    set_((k) => ({
      ...k,
      [f]: {
        caption: "",
        tags: "",
        ...k[f],
        ...j,
      },
    }));
  const G = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      toast.error("Please sign in");
      return;
    }
    const j = n === "new" ? m.trim() : a.find((u) => u.id === n)?.name;
    if (!j) {
      toast.error("Give the vault a name");
      return;
    }
    setW(true);
    try {
      let vaultId = n;
      if (n === "new") {
        const { data: data_2, error: error_3 } = await supabase
          .from("vaults")
          .insert({
            user_id: user.id,
            name: j,
            cover_url: photos[0]?.url ?? null,
          })
          .select("id")
          .single();
        if (error_3 && error_3.code === "23505") {
          const { data: data_3 } = await supabase
            .from("vaults")
            .select("id")
            .eq("user_id", user.id)
            .ilike("name", j)
            .maybeSingle();
          if (!data_3) {
            throw error_3;
          }
          vaultId = data_3.id;
        } else {
          if (error_3) {
            throw error_3;
          }
          vaultId = data_2.id;
        }
      }
      const A = photos.map((I) => ({
        galleryImageId: I.id,
        url: I.url,
        fileType: Bt(I.title ?? I.url),
        caption: _[I.id]?.caption ?? "",
        tags: (_[I.id]?.tags ?? "")
          .split(",")
          .map((je) => je.trim())
          .filter(Boolean),
      }));
      const { data } = await supabase
        .from("vault_items")
        .select("memories(metadata)")
        .eq("vault_id", vaultId)
        .eq("user_id", user.id);
      const L = new Set(
        (data ?? []).map((I) => I.memories?.metadata?.gallery_image_id).filter((I) => typeof I === "string"),
      );
      const { fresh, duplicates } = Dt(A, L);
      if (fresh.length === 0) {
        toast.info(
          duplicates === 1 ? `That photo is already in ${j}.` : `Those ${duplicates} photos are already in ${j}.`,
        );
        onOpenChange(false);
        return;
      }
      const { memories } = Lt({
        userId: user.id,
        vaultId,
        vaultName: j,
        drafts: fresh,
        nowIso: new Date().toISOString(),
      });
      const { data: data_1, error } = await supabase.from("memories").insert(memories).select("id");
      if (error) {
        throw error;
      }
      const W = (data_1 ?? []).map((I) => I.id);
      if (W.length !== fresh.length) {
        throw new Error("memory insert returned an unexpected number of rows");
      }
      const { error: error_1 } = await supabase.from("memory_media").insert(W.map((I, E) => Tt(I, fresh[E])));
      if (error_1) {
        throw error_1;
      }
      const { error: error_2 } = await supabase.from("vault_items").insert(
        W.map((memoryId, E) =>
          Rt({
            vaultId,
            userId: user.id,
            memoryId,
            index: E,
          }),
        ),
      );
      if (error_2) {
        throw error_2;
      }
      toast.success(
        `Added ${W.length} photo${W.length === 1 ? "" : "s"} to ${j}` +
          (duplicates > 0 ? ` — ${duplicates} already there` : ""),
      );
      onSaved();
      onOpenChange(false);
    } catch (error) {
      console.error("Vault save failed:", error);
      toast.error("Couldn't save to the vault — check the console for details");
    } finally {
      setW(false);
    }
  };
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{t_1("vault.addTo")}</DialogTitle>
          <DialogDescription>
            {photos.length} photo{photos.length === 1 ? "" : "s"} — captions and tags are what let you ask Alma for them
            later.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-2">
          <Label htmlFor="vault-pick">{t_1("vault.label")}</Label>
          <select
            id="vault-pick"
            className="w-full h-10 rounded-md border border-input bg-background px-3 text-sm"
            value={n}
            onChange={(f) => setN(f.target.value)}
          >
            <option value="new">➕ New vault…</option>
            {a.map((f) => (
              <option key={f.id} value={f.id}>
                {f.name}
              </option>
            ))}
          </select>
          {n === "new" && <Input placeholder="e.g. Goa 2019" value={m} onChange={(f) => setM(f.target.value)} />}
        </div>
        {h && (
          <p className="flex items-center gap-2 text-xs text-muted-foreground">
            <Sparkles className="h-3 w-3 animate-pulse" /> Alma is looking at your photos…
          </p>
        )}
        <div className="space-y-4">
          {photos.map((f) => (
            <div key={f.id} className="flex gap-3">
              <img src={f.url} alt="" className="h-24 w-24 rounded-md object-cover flex-shrink-0" />
              <div className="flex-1 space-y-2">
                <Textarea
                  rows={2}
                  placeholder={t_1("vault.captionAsk")}
                  value={_[f.id]?.caption ?? ""}
                  onChange={($) =>
                    O(f.id, {
                      caption: $.target.value,
                    })
                  }
                />
                <Input
                  placeholder="tags, comma separated"
                  value={_[f.id]?.tags ?? ""}
                  onChange={($) =>
                    O(f.id, {
                      tags: $.target.value,
                    })
                  }
                />
              </div>
            </div>
          ))}
        </div>
        <DialogFooter>
          <Button variant="ghost" onClick={() => onOpenChange(false)} disabled={w}>
            {t_1("action.cancel")}
          </Button>
          <Button onClick={G} disabled={w || photos.length === 0}>
            {w && <LoaderCircle className="me-2 h-4 w-4 animate-spin" />}Save to vault
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
const zt =
  "data:image/svg+xml,%3csvg%20preserveAspectRatio='none'%20overflow='visible'%20style='display:%20block;'%20width='16'%20height='16'%20viewBox='0%200%2016%2016'%20fill='none'%20xmlns='http://www.w3.org/2000/svg'%3e%3cg%20id='Frame'%3e%3cpath%20id='Vector'%20d='M14%205.33333C13.9998%205.09952%2013.938%204.86987%2013.821%204.66744C13.704%204.46501%2013.5358%204.29691%2013.3333%204.18L8.66667%201.51333C8.46397%201.39631%208.23405%201.3347%208%201.3347C7.76595%201.3347%207.53603%201.39631%207.33333%201.51333L2.66667%204.18C2.46418%204.29691%202.29599%204.46501%202.17897%204.66744C2.06196%204.86987%202.00024%205.09952%202%205.33333V10.6667C2.00024%2010.9005%202.06196%2011.1301%202.17897%2011.3326C2.29599%2011.535%202.46418%2011.7031%202.66667%2011.82L7.33333%2014.4867C7.53603%2014.6037%207.76595%2014.6653%208%2014.6653C8.23405%2014.6653%208.46397%2014.6037%208.66667%2014.4867L13.3333%2011.82C13.5358%2011.7031%2013.704%2011.535%2013.821%2011.3326C13.938%2011.1301%2013.9998%2010.9005%2014%2010.6667V5.33333Z'%20stroke='%2317324d'%20stroke-linecap='round'%20stroke-linejoin='round'/%3e%3cpath%20id='Vector_2'%20d='M2.2%204.66667L8%208L13.8%204.66667'%20stroke='%2317324d'%20stroke-linecap='round'%20stroke-linejoin='round'/%3e%3cpath%20id='Vector_3'%20d='M8%2014.6667V8'%20stroke='%2317324d'%20stroke-linecap='round'%20stroke-linejoin='round'/%3e%3c/g%3e%3c/svg%3e";
const Pt =
  "data:image/svg+xml,%3csvg%20preserveAspectRatio='none'%20overflow='visible'%20style='display:%20block;'%20width='16'%20height='16'%20viewBox='0%200%2016%2016'%20fill='none'%20xmlns='http://www.w3.org/2000/svg'%3e%3cg%20id='Frame'%3e%3cpath%20id='Vector'%20d='M8%208.66667V14'%20stroke='%2317324d'%20stroke-linecap='round'%20stroke-linejoin='round'/%3e%3cpath%20id='Vector_2'%20d='M2.66667%209.93267C2.17136%209.42661%201.79771%208.81448%201.57402%208.14263C1.35033%207.47077%201.28247%206.75683%201.37557%206.05487C1.46868%205.3529%201.7203%204.68133%202.1114%204.09102C2.50249%203.50071%203.02279%203.00714%203.63289%202.6477C4.24299%202.28826%204.92688%202.07237%205.63278%202.01639C6.33867%201.9604%207.04805%202.06579%207.70718%202.32457C8.36631%202.58335%208.9579%202.98874%209.43716%203.51003C9.91641%204.03131%2010.2707%204.65482%2010.4733%205.33333H11.6667C12.3103%205.33326%2012.937%205.54021%2013.454%205.92363C13.971%206.30704%2014.351%206.84658%2014.5378%207.46254C14.7247%208.0785%2014.7085%208.73822%2014.4916%209.34425C14.2747%209.95028%2013.8686%2010.4705%2013.3333%2010.828'%20stroke='%2317324d'%20stroke-linecap='round'%20stroke-linejoin='round'/%3e%3cpath%20id='Vector_3'%20d='M5.33333%2011.3333L8%208.66667L10.6667%2011.3333'%20stroke='%2317324d'%20stroke-linecap='round'%20stroke-linejoin='round'/%3e%3c/g%3e%3c/svg%3e";
const iconLayers =
  "data:image/svg+xml,%3csvg%20preserveAspectRatio='none'%20overflow='visible'%20style='display:%20block;'%20width='18'%20height='18'%20viewBox='0%200%2018%2018'%20fill='none'%20xmlns='http://www.w3.org/2000/svg'%3e%3cg%20id='icon/layers'%3e%3cpath%20id='Vector'%20d='M9%201.5L15.75%205.25L9%209L2.25%205.25L9%201.5Z'%20stroke='%2317324d'%20stroke-opacity='0.9'%20stroke-width='1.35'%20stroke-linecap='round'%20stroke-linejoin='round'/%3e%3cpath%20id='Vector_2'%20d='M2.25%209L9%2012.75L15.75%209'%20stroke='%2317324d'%20stroke-opacity='0.9'%20stroke-width='1.35'%20stroke-linecap='round'%20stroke-linejoin='round'/%3e%3cpath%20id='Vector_3'%20d='M2.25%2012.75L9%2016.5L15.75%2012.75'%20stroke='%2317324d'%20stroke-opacity='0.9'%20stroke-width='1.35'%20stroke-linecap='round'%20stroke-linejoin='round'/%3e%3c/g%3e%3c/svg%3e";
const iconUsers =
  "data:image/svg+xml,%3csvg%20preserveAspectRatio='none'%20overflow='visible'%20style='display:%20block;'%20width='18'%20height='18'%20viewBox='0%200%2018%2018'%20fill='none'%20xmlns='http://www.w3.org/2000/svg'%3e%3cg%20id='icon/users'%3e%3cpath%20id='Vector'%20d='M12%2015.75V14.25C12%2013.4544%2011.6839%2012.6913%2011.1213%2012.1287C10.5587%2011.5661%209.79565%2011.25%209%2011.25H4.5C3.70435%2011.25%202.94129%2011.5661%202.37868%2012.1287C1.81607%2012.6913%201.5%2013.4544%201.5%2014.25V15.75'%20stroke='%2317324d'%20stroke-opacity='0.6'%20stroke-width='1.35'%20stroke-linecap='round'%20stroke-linejoin='round'/%3e%3cpath%20id='Vector_2'%20d='M6.75%208.25C8.40685%208.25%209.75%206.90685%209.75%205.25C9.75%203.59315%208.40685%202.25%206.75%202.25C5.09315%202.25%203.75%203.59315%203.75%205.25C3.75%206.90685%205.09315%208.25%206.75%208.25Z'%20stroke='%2317324d'%20stroke-opacity='0.6'%20stroke-width='1.35'%20stroke-linecap='round'%20stroke-linejoin='round'/%3e%3cpath%20id='Vector_3'%20d='M16.5%2015.75V14.25C16.5045%2013.5814%2016.2856%2012.9305%2015.8779%2012.4006C15.4703%2011.8707%2014.8973%2011.4921%2014.25%2011.325'%20stroke='%2317324d'%20stroke-opacity='0.6'%20stroke-width='1.35'%20stroke-linecap='round'%20stroke-linejoin='round'/%3e%3c/g%3e%3c/svg%3e";
const iconPin =
  "data:image/svg+xml,%3csvg%20preserveAspectRatio='none'%20overflow='visible'%20style='display:%20block;'%20width='18'%20height='18'%20viewBox='0%200%2018%2018'%20fill='none'%20xmlns='http://www.w3.org/2000/svg'%3e%3cg%20id='icon/pin'%3e%3cpath%20id='Vector'%20d='M15%207.5C15%2012%209%2016.5%209%2016.5C9%2016.5%203%2012%203%207.5C3%205.9087%203.63214%204.38258%204.75736%203.25736C5.88258%202.13214%207.4087%201.5%209%201.5C10.5913%201.5%2012.1174%202.13214%2013.2426%203.25736C14.3679%204.38258%2015%205.9087%2015%207.5Z'%20stroke='%2317324d'%20stroke-opacity='0.6'%20stroke-width='1.35'%20stroke-linecap='round'%20stroke-linejoin='round'/%3e%3cpath%20id='Vector_2'%20d='M9%209.75C10.2426%209.75%2011.25%208.74264%2011.25%207.5C11.25%206.25736%2010.2426%205.25%209%205.25C7.75736%205.25%206.75%206.25736%206.75%207.5C6.75%208.74264%207.75736%209.75%209%209.75Z'%20stroke='%2317324d'%20stroke-opacity='0.6'%20stroke-width='1.35'%20stroke-linecap='round'%20stroke-linejoin='round'/%3e%3c/g%3e%3c/svg%3e";
const iconUp =
  "data:image/svg+xml,%3csvg%20preserveAspectRatio='none'%20overflow='visible'%20style='display:%20block;'%20width='22'%20height='22'%20viewBox='0%200%2022%2022'%20fill='none'%20xmlns='http://www.w3.org/2000/svg'%3e%3cg%20id='icon/up'%3e%3cpath%20id='Vector'%20d='M19.25%2013.75V17.4167C19.25%2017.9029%2019.0568%2018.3692%2018.713%2018.713C18.3692%2019.0568%2017.9029%2019.25%2017.4167%2019.25H4.58333C4.0971%2019.25%203.63079%2019.0568%203.28697%2018.713C2.94315%2018.3692%202.75%2017.9029%202.75%2017.4167V13.75'%20stroke-width='1.65'%20stroke-linecap='round'%20stroke-linejoin='round'%20stroke='%23526779'%20stroke-opacity='0.7'/%3e%3cpath%20id='Vector_2'%20d='M15.5833%207.33333L11%202.75L6.41667%207.33333'%20stroke-width='1.65'%20stroke-linecap='round'%20stroke-linejoin='round'%20stroke='%23526779'%20stroke-opacity='0.7'/%3e%3cpath%20id='Vector_3'%20d='M11%202.75V14.6667'%20stroke-width='1.65'%20stroke-linecap='round'%20stroke-linejoin='round'%20stroke='%23526779'%20stroke-opacity='0.7'/%3e%3c/g%3e%3c/svg%3e";
const iconClock =
  "data:image/svg+xml,%3csvg%20preserveAspectRatio='none'%20overflow='visible'%20style='display:%20block;'%20width='16'%20height='16'%20viewBox='0%200%2016%2016'%20fill='none'%20xmlns='http://www.w3.org/2000/svg'%3e%3cg%20id='icon/clock'%3e%3cpath%20id='Vector'%20d='M14%208C14%2011.3137%2011.3137%2014%208%2014C4.68629%2014%202%2011.3137%202%208C2%204.68629%204.68629%202%208%202C11.3137%202%2014%204.68629%2014%208Z'%20stroke-width='1.2'%20stroke-linecap='round'%20stroke-linejoin='round'%20stroke='%23526779'%20stroke-opacity='0.5'/%3e%3cpath%20id='Vector_2'%20d='M8%204.66667V8L10%209.33333'%20stroke-width='1.2'%20stroke-linecap='round'%20stroke-linejoin='round'%20stroke='%23526779'%20stroke-opacity='0.5'/%3e%3c/g%3e%3c/svg%3e";
const iconOrbit =
  "data:image/svg+xml,%3csvg%20preserveAspectRatio='none'%20overflow='visible'%20style='display:%20block;'%20width='16'%20height='16'%20viewBox='0%200%2016%2016'%20fill='none'%20xmlns='http://www.w3.org/2000/svg'%3e%3cg%20id='icon/orbit'%3e%3cpath%20id='Vector'%20d='M10%208C10%209.10457%209.10457%2010%208%2010C6.89543%2010%206%209.10457%206%208C6%206.89543%206.89543%206%208%206C9.10457%206%2010%206.89543%2010%208Z'%20stroke-width='1.2'%20stroke-linecap='round'%20stroke-linejoin='round'%20stroke='%23526779'%20stroke-opacity='0.5'/%3e%3cpath%20id='Vector_2'%20d='M14.6667%208C14.6667%209.65685%2011.6819%2011%208%2011C4.3181%2011%201.33333%209.65685%201.33333%208C1.33333%206.34315%204.3181%205%208%205C11.6819%205%2014.6667%206.34315%2014.6667%208Z'%20stroke-width='1.2'%20stroke-linecap='round'%20stroke-linejoin='round'%20stroke='%23526779'%20stroke-opacity='0.5'/%3e%3c/g%3e%3c/svg%3e";
const iconGrid =
  "data:image/svg+xml,%3csvg%20preserveAspectRatio='none'%20overflow='visible'%20style='display:%20block;'%20width='16'%20height='16'%20viewBox='0%200%2016%2016'%20fill='none'%20xmlns='http://www.w3.org/2000/svg'%3e%3cg%20id='icon/grid'%3e%3cpath%20id='Vector'%20d='M3%202H5.66667C6.21895%202%206.66667%202.44772%206.66667%203V5.66667C6.66667%206.21895%206.21895%206.66667%205.66667%206.66667H3C2.44772%206.66667%202%206.21895%202%205.66667V3C2%202.44772%202.44772%202%203%202Z'%20stroke-width='1.2'%20stroke-linecap='round'%20stroke-linejoin='round'%20stroke='%2317324D'/%3e%3cpath%20id='Vector_2'%20d='M10.3333%202H13C13.5523%202%2014%202.44772%2014%203V5.66667C14%206.21895%2013.5523%206.66667%2013%206.66667H10.3333C9.78105%206.66667%209.33333%206.21895%209.33333%205.66667V3C9.33333%202.44772%209.78105%202%2010.3333%202Z'%20stroke-width='1.2'%20stroke-linecap='round'%20stroke-linejoin='round'%20stroke='%2317324D'/%3e%3cpath%20id='Vector_3'%20d='M3%209.33333H5.66667C6.21895%209.33333%206.66667%209.78105%206.66667%2010.3333V13C6.66667%2013.5523%206.21895%2014%205.66667%2014H3C2.44772%2014%202%2013.5523%202%2013V10.3333C2%209.78105%202.44772%209.33333%203%209.33333Z'%20stroke-width='1.2'%20stroke-linecap='round'%20stroke-linejoin='round'%20stroke='%2317324D'/%3e%3cpath%20id='Vector_4'%20d='M10.3333%209.33333H13C13.5523%209.33333%2014%209.78105%2014%2010.3333V13C14%2013.5523%2013.5523%2014%2013%2014H10.3333C9.78105%2014%209.33333%2013.5523%209.33333%2013V10.3333C9.33333%209.78105%209.78105%209.33333%2010.3333%209.33333Z'%20stroke-width='1.2'%20stroke-linecap='round'%20stroke-linejoin='round'%20stroke='%2317324D'/%3e%3c/g%3e%3c/svg%3e";
const Jt = [
  {
    key: "timeline",
    label: "Timeline",
    icon: iconCircle,
  },
  {
    key: "orbit",
    label: "Orbit",
    icon: zt,
  },
  {
    key: "grid",
    label: "Grid",
    icon: iconGridImported,
  },
];
function XtComponent({ view, onViewChange, onUpload, uploading }) {
  const { t: t_1 } = useI18n();
  const a = useMobileNav();
  const i = useSearchPalette();
  return (
    <>
      <MobileTopBar
        title={t_1("nav.gallery")}
        leading={{
          icon: iconMenu,
          label: t_1("nav.menu"),
          onClick: a.open,
        }}
        actions={[
          {
            icon: iconSearchLarge,
            label: t_1("nav.search"),
            onClick: i.open,
          },
          {
            icon: iconUp,
            label: t_1("gallery.uploadPhotos"),
            onClick: onUpload,
          },
        ]}
      />
      <div className="px-4 pb-3 md:hidden">
        <MobileSegmented
          segments={[
            {
              value: "timeline",
              label: t_1("memories.view.timeline"),
              icon: iconClock,
            },
            {
              value: "orbit",
              label: t_1("gallery.view.orbit"),
              icon: iconOrbit,
            },
            {
              value: "grid",
              label: t_1("memories.view.grid"),
              icon: iconGrid,
            },
          ]}
          value={view}
          onChange={onViewChange}
          aria-label={t_1("gallery.viewSwitcher")}
        />
      </div>
      <div className="hidden flex-wrap items-center justify-between gap-4 px-4 pb-5 pt-8 sm:px-6 md:flex lg:px-[30px] lg:pt-[38px]">
        <div className="flex flex-col gap-3">
          <p className="font-body text-sm tracking-[0.14px] text-[rgba(23,50,77,0.6)] opacity-80">3D memory gallery</p>
          <h1 className="font-display text-xl font-semibold tracking-[0.2px] text-alma-ink/80">
            {t_1("gallery.everything")}
          </h1>
        </div>
        <div
          role="tablist"
          aria-label={t_1("gallery.viewSwitcher")}
          className="flex items-center gap-[5px] rounded-[24px] border border-[#d5e2ec] p-[3px]"
        >
          {Jt.map((n) => {
            const g = view === n.key;
            return (
              <button
                key={n.key}
                role="tab"
                aria-selected={g}
                onClick={() => onViewChange(n.key)}
                className="relative flex h-[37px] items-center gap-2.5 rounded-[24px] px-4 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-alma-accent-ring"
              >
                {g && (
                  <motion.span
                    layoutId="gallery-view-pill"
                    transition={springSnappy}
                    className="absolute inset-0 rounded-[24px] bg-alma-panel"
                  />
                )}
                <img src={n.icon} alt="" className="relative h-4 w-4 shrink-0" />
                <span className="relative font-body text-base tracking-[0.32px] text-alma-ink">{n.label}</span>
              </button>
            );
          })}
        </div>
        <button
          type="button"
          onClick={onUpload}
          disabled={uploading}
          className="flex h-[45px] items-center gap-2.5 rounded-[12px] bg-gradient-to-r from-alma-accent-from to-alma-accent-to px-3 font-body text-base tracking-[0.32px] text-white shadow-[0px_2px_6px_0px_rgba(40,94,133,0.18)] transition-opacity hover:opacity-90 disabled:opacity-60 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-alma-accent-ring"
        >
          <img src={Pt} alt="" className="brightness-0 invert h-4 w-4" />
          {uploading ? "Uploading…" : "Upload"}
        </button>
      </div>
    </>
  );
}
const Qt = [
  {
    key: "all",
    label: "All",
    icon: iconLayers,
  },
  {
    key: "people",
    label: "People",
    icon: iconUsers,
  },
  {
    key: "places",
    label: "Places",
    icon: iconPin,
  },
  {
    key: "favourites",
    label: "Favourites",
    icon: iconStar,
  },
];
function NeComponent({ filter, onFilterChange, disabled = [], className }) {
  useI18n();
  return (
    <div className={cn("flex flex-wrap items-center gap-2", className)}>
      {Qt.map((l) => {
        const disabled_1 = disabled.includes(l.key);
        const i = filter === l.key;
        return (
          <button
            key={l.key}
            type="button"
            disabled={disabled_1}
            title={disabled_1 ? `${l.label} needs data ALMA does not store yet` : undefined}
            onClick={() => onFilterChange(l.key)}
            className={cn(
              "flex items-center gap-[7px] rounded-full border py-2 ps-3 pe-3.5 font-body text-xs font-medium tracking-[0.24px] transition-colors",
              "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-alma-accent-ring",
              i
                ? "border-[rgba(23,50,77,0.22)] bg-alma-panel text-alma-ink"
                : "border-[rgba(23,50,77,0.11)] bg-white/[0.82] text-[rgba(23,50,77,0.75)] hover:bg-white",
              disabled_1 && "cursor-not-allowed opacity-45 hover:bg-white/[0.82]",
            )}
          >
            <img src={l.icon} alt="" className="h-[18px] w-[18px] shrink-0" />
            {l.label}
          </button>
        );
      })}
    </div>
  );
}
const ee = {
  width: 1140,
  height: 760,
  cx: 570,
  cy: 408,
};
const _e = [
  {
    key: "week",
    label: "This week",
    rx: 195,
    ry: 92,
    tile: 118,
    cap: 6,
  },
  {
    key: "month",
    label: "This month",
    rx: 330,
    ry: 150,
    tile: 100,
    cap: 6,
  },
  {
    key: "year",
    label: "Earlier in",
    rx: 452,
    ry: 208,
    tile: 78,
    cap: 6,
  },
  {
    key: "before",
    label: "& before",
    rx: 534,
    ry: 266,
    tile: 60,
    cap: 6,
  },
];
const es = 86400000;
function $e(t) {
  return new Date(t.getFullYear(), t.getMonth(), t.getDate()).getTime();
}
function ts(t) {
  let s = 2166136261;
  for (let o = 0; o < t.length; o++) {
    s ^= t.charCodeAt(o);
    s = Math.imul(s, 16777619);
  }
  return (s >>> 0) / 4294967295;
}
function Ke(takenAt, s) {
  if (!takenAt) {
    return 3;
  }
  const o = new Date(takenAt);
  if (Number.isNaN(o.getTime())) {
    return 3;
  }
  if (Math.floor(($e(s) - $e(o)) / es) < 7) {
    return 0;
  }
  if (o.getFullYear() === s.getFullYear() && o.getMonth() === s.getMonth()) {
    return 1;
  }
  if (o.getFullYear() === s.getFullYear()) {
    return 2;
  }
  return 3;
}
function ss(t, now) {
  switch (t) {
    case 2:
      return `Earlier in ${now.getFullYear()}`;
    case 3:
      return `${now.getFullYear() - 1} & before`;
    default:
      return _e[t].label;
  }
}
function os(items, now) {
  const o = [0, 0, 0, 0];
  for (const r of items) {
    o[Ke(r.takenAt, now)] += 1;
  }
  return o;
}
function as(items, now, o = 0) {
  const r = [[], [], [], []];
  for (const a of items) {
    r[Ke(a.takenAt, now)].push(a);
  }
  const l = [];
  r.forEach((a, ringIndex) => {
    const n = _e[ringIndex];
    const g = [...a].sort((m, N) => new Date(N.takenAt).getTime() - new Date(m.takenAt).getTime()).slice(0, n.cap);
    g.forEach((m, N) => {
      const _ = ts(m.id);
      const F = ringIndex * 0.7;
      const angle = (2 * Math.PI * N) / Math.max(1, g.length) + F + o;
      const y = 0.92 + _ * 0.16;
      l.push({
        item: m,
        ringIndex,
        angle,
        size: Math.round(n.tile * (0.86 + _ * 0.3)),
        x: ee.cx + Math.cos(angle) * n.rx * y,
        y: ee.cy + Math.sin(angle) * n.ry * y,
      });
    });
  });
  return l.sort((a, i) => a.y - i.y);
}
function rs(items, now) {
  const o = now.getMonth();
  const r = now.getDate();
  const l = items.filter((a) => {
    const i = new Date(a.takenAt);
    if (Number.isNaN(i.getTime())) {
      return false;
    }
    return i.getFullYear() < now.getFullYear() && i.getMonth() === o && i.getDate() === r;
  });
  if (l.length === 0) {
    return null;
  }
  return l.sort((a, i) => new Date(i.takenAt).getTime() - new Date(a.takenAt).getTime())[0];
}
function is(t, now) {
  const o = now.getFullYear() - new Date(t.takenAt).getFullYear();
  if (o === 1) {
    return "1 year ago today";
  }
  return `${o} years ago today`;
}
function ns(items, now, length) {
  const r = items.map((g) => new Date(g.takenAt).getTime()).filter((g) => !Number.isNaN(g));
  if (r.length === 0 || length <= 0) {
    return [];
  }
  const l = now.getTime();
  const a = Math.min(...r, l);
  const i = l - a;
  const n = Array.from(
    {
      length,
    },
    (g, m) => ({
      index: m,
      count: 0,
      startedAt: new Date(a + (Math.max(i, 0) * m) / length),
    }),
  );
  if (i <= 0) {
    n[length - 1].count = r.length;
    return n;
  }
  for (const g of r) {
    const m = (g - a) / i;
    const N = Math.min(length - 1, Math.max(0, Math.floor(m * length)));
    n[N].count += 1;
  }
  return n;
}
const Be = {
  places: [],
  people: [],
  revisits: 0,
};
const iconRotate =
  "data:image/svg+xml,%3csvg%20preserveAspectRatio='none'%20overflow='visible'%20style='display:%20block;'%20width='18'%20height='18'%20viewBox='0%200%2018%2018'%20fill='none'%20xmlns='http://www.w3.org/2000/svg'%3e%3cg%20id='icon/rotate'%3e%3cpath%20id='Vector'%20d='M15.75%209C15.75%2010.335%2015.3541%2011.6401%2014.6124%2012.7501C13.8707%2013.8601%2012.8165%2014.7253%2011.5831%2015.2362C10.3497%2015.7471%208.99251%2015.8808%207.68314%2015.6203C6.37377%2015.3599%205.17103%2014.717%204.22703%2013.773C3.28302%2012.829%202.64015%2011.6262%202.3797%2010.3169C2.11925%209.00749%202.25292%207.65029%202.76381%206.41689C3.2747%205.18349%204.13987%204.12928%205.2499%203.38758C6.35993%202.64588%207.66498%202.25%209%202.25C10.875%202.25%2012.675%203%2014.025%204.275L15.75%206'%20stroke='%2317324d'%20stroke-opacity='0.9'%20stroke-width='1.35'%20stroke-linecap='round'%20stroke-linejoin='round'/%3e%3cpath%20id='Vector_2'%20d='M15.75%202.25V6H12'%20stroke='%2317324d'%20stroke-opacity='0.9'%20stroke-width='1.35'%20stroke-linecap='round'%20stroke-linejoin='round'/%3e%3c/g%3e%3c/svg%3e";
const iconFocus =
  "data:image/svg+xml,%3csvg%20preserveAspectRatio='none'%20overflow='visible'%20style='display:%20block;'%20width='18'%20height='18'%20viewBox='0%200%2018%2018'%20fill='none'%20xmlns='http://www.w3.org/2000/svg'%3e%3cg%20id='icon/focus'%3e%3cpath%20id='Vector'%20d='M9%2011.25C10.2426%2011.25%2011.25%2010.2426%2011.25%209C11.25%207.75736%2010.2426%206.75%209%206.75C7.75736%206.75%206.75%207.75736%206.75%209C6.75%2010.2426%207.75736%2011.25%209%2011.25Z'%20stroke='%2317324d'%20stroke-opacity='0.6'%20stroke-width='1.35'%20stroke-linecap='round'%20stroke-linejoin='round'/%3e%3cpath%20id='Vector_2'%20d='M6%202.25H3.75C3.35218%202.25%202.97064%202.40804%202.68934%202.68934C2.40804%202.97064%202.25%203.35218%202.25%203.75V6M15.75%206V3.75C15.75%203.35218%2015.592%202.97064%2015.3107%202.68934C15.0294%202.40804%2014.6478%202.25%2014.25%202.25H12M2.25%2012V14.25C2.25%2014.6478%202.40804%2015.0294%202.68934%2015.3107C2.97064%2015.592%203.35218%2015.75%203.75%2015.75H6M12%2015.75H14.25C14.6478%2015.75%2015.0294%2015.592%2015.3107%2015.3107C15.592%2015.0294%2015.75%2014.6478%2015.75%2014.25V12'%20stroke='%2317324d'%20stroke-opacity='0.6'%20stroke-width='1.35'%20stroke-linecap='round'%20stroke-linejoin='round'/%3e%3c/g%3e%3c/svg%3e";
const iconReset =
  "data:image/svg+xml,%3csvg%20preserveAspectRatio='none'%20overflow='visible'%20style='display:%20block;'%20width='18'%20height='18'%20viewBox='0%200%2018%2018'%20fill='none'%20xmlns='http://www.w3.org/2000/svg'%3e%3cg%20id='icon/reset'%3e%3cpath%20id='Vector'%20d='M2.25%209C2.25%2010.335%202.64588%2011.6401%203.38758%2012.7501C4.12928%2013.8601%205.18349%2014.7253%206.41689%2015.2362C7.65029%2015.7471%209.00749%2015.8808%2010.3169%2015.6203C11.6262%2015.3599%2012.829%2014.717%2013.773%2013.773C14.717%2012.829%2015.3599%2011.6262%2015.6203%2010.3169C15.8808%209.00749%2015.7471%207.65029%2015.2362%206.41689C14.7253%205.18349%2013.8601%204.12928%2012.7501%203.38758C11.6401%202.64588%2010.335%202.25%209%202.25'%20stroke='%2317324d'%20stroke-opacity='0.6'%20stroke-width='1.35'%20stroke-linecap='round'%20stroke-linejoin='round'/%3e%3cpath%20id='Vector_2'%20d='M2.25%203V6.75H6'%20stroke='%2317324d'%20stroke-opacity='0.6'%20stroke-width='1.35'%20stroke-linecap='round'%20stroke-linejoin='round'/%3e%3cpath%20id='Vector_3'%20d='M9%209.75C9.41421%209.75%209.75%209.41421%209.75%209C9.75%208.58579%209.41421%208.25%209%208.25C8.58579%208.25%208.25%208.58579%208.25%209C8.25%209.41421%208.58579%209.75%209%209.75Z'%20stroke='%2317324d'%20stroke-opacity='0.6'%20stroke-width='1.35'%20stroke-linecap='round'%20stroke-linejoin='round'/%3e%3c/g%3e%3c/svg%3e";
const iconPlus =
  "data:image/svg+xml,%3csvg%20preserveAspectRatio='none'%20overflow='visible'%20style='display:%20block;'%20width='18'%20height='18'%20viewBox='0%200%2018%2018'%20fill='none'%20xmlns='http://www.w3.org/2000/svg'%3e%3cg%20id='icon/plus'%3e%3cpath%20id='Vector'%20d='M3.75%209H14.25M9%203.75V14.25'%20stroke='%2317324d'%20stroke-opacity='0.7'%20stroke-width='1.35'%20stroke-linecap='round'%20stroke-linejoin='round'/%3e%3c/g%3e%3c/svg%3e";
const iconMinus =
  "data:image/svg+xml,%3csvg%20preserveAspectRatio='none'%20overflow='visible'%20style='display:%20block;'%20width='18'%20height='18'%20viewBox='0%200%2018%2018'%20fill='none'%20xmlns='http://www.w3.org/2000/svg'%3e%3cg%20id='icon/minus'%3e%3cpath%20id='Vector'%20d='M3.75%209H14.25'%20stroke='%2317324d'%20stroke-opacity='0.7'%20stroke-width='1.35'%20stroke-linecap='round'%20stroke-linejoin='round'/%3e%3c/g%3e%3c/svg%3e";
const Z = (t) => `${(t / ee.width) * 100}%`;
const z = (t) => `${(t / ee.height) * 100}%`;
const gs = [
  [120, 150, 5],
  [210, 690, 4],
  [300, 120, 3],
  [430, 720, 5],
  [690, 110, 4],
  [880, 180, 6],
  [980, 610, 5],
  [760, 700, 4],
  [150, 430, 3],
  [1020, 330, 4],
  [520, 88, 3],
  [640, 730, 5],
  [330, 560, 3],
  [900, 470, 3],
  [60, 610, 4],
  [1080, 690, 4],
  [400, 250, 3],
  [820, 620, 3],
];
const Ee = 0.65;
const Oe = 1.9;
function Ms1Component({ items, now, totalCount, hoveredId, overlay, onHover, onOpen, children }) {
  const { t: t_1 } = useI18n();
  const m = useReducedMotion();
  const NRef = React.useRef(null);
  const [_, set_] = React.useState(0);
  const [scale, setScale] = React.useState(1);
  const [w, setW] = React.useState(false);
  const CRef = React.useRef(null);
  const ORef = React.useRef(false);
  const G = React.useMemo(() => as(items, now, _), [items, now, _]);
  const f = React.useMemo(() => os(items, now), [items, now]);
  const j = React.useMemo(() => rs(items, now), [items, now]);
  const k = G.find((p) => p.item.id === j?.id) ?? null;
  React.useEffect(() => {
    if (!w || m) {
      return;
    }
    let p = 0;
    let x = performance.now();
    const T = (Y) => {
      const ne = Y - x;
      x = Y;
      set_((W) => W + ne * 0.00006);
      p = requestAnimationFrame(T);
    };
    p = requestAnimationFrame(T);
    return () => cancelAnimationFrame(p);
  }, [w, m]);
  const onPointerDown = (p) => {
    CRef.current = {
      x: p.clientX,
      from: _,
    };
    ORef.current = false;
    p.currentTarget.setPointerCapture(p.pointerId);
  };
  const onPointerMove = (p) => {
    if (!CRef.current) {
      return;
    }
    const x = p.clientX - CRef.current.x;
    if (Math.abs(x) > 4) {
      ORef.current = true;
    }
    set_(CRef.current.from + x * 0.005);
  };
  const A = (p) => {
    CRef.current = null;
    p.currentTarget.releasePointerCapture?.(p.pointerId);
  };
  React.useEffect(() => {
    const NRef_current = NRef.current;
    if (!NRef_current) {
      return;
    }
    const x = (T) => {
      T.preventDefault();
      setScale((Y) => Math.min(Oe, Math.max(Ee, Y - T.deltaY * 0.0015)));
    };
    NRef_current.addEventListener("wheel", x, {
      passive: false,
    });
    return () => NRef_current.removeEventListener("wheel", x);
  }, []);
  const H = () => {
    set_(0);
    setScale(1);
    setW(false);
  };
  const LComponent = (title, x, T, Y = false) => (
    <button
      type="button"
      onClick={T}
      aria-label={title}
      aria-pressed={Y}
      title={title}
      className={cn(
        "flex size-9 shrink-0 items-center justify-center rounded-[12px] border transition-colors",
        "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-alma-accent-ring",
        Y
          ? "border-[rgba(23,50,77,0.22)] bg-alma-panel"
          : "border-[rgba(23,50,77,0.11)] bg-white/[0.88] hover:bg-white",
      )}
    >
      <img src={x} alt="" className="h-[18px] w-[18px]" />
    </button>
  );
  return (
    <div className="flex min-h-0 flex-1 flex-col gap-3">
      <div className="flex shrink-0 flex-wrap items-center justify-between gap-3">
        {children}
        <div className="flex items-center gap-2.5">
          <span className="font-body text-xs tracking-[0.24px] text-[rgba(23,50,77,0.55)]">
            {totalCount === 0 ? "Nothing in orbit yet" : `Showing ${G.length} of ${totalCount.toLocaleString()}`}
          </span>
          {LComponent("Auto-rotate", iconRotate, () => setW((p) => !p), w)}
          {LComponent("Zoom to fit", iconFocus, () => setScale(1))}
          {LComponent("Reset view", iconReset, H)}
        </div>
      </div>
      <div className="flex min-h-0 flex-1 items-center justify-center">
        <div
          ref={NRef}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={A}
          onPointerCancel={A}
          className="relative h-full touch-none select-none overflow-hidden rounded-[20px]"
          style={{
            aspectRatio: `${ee.width} / ${ee.height}`,
            maxWidth: "100%",
          }}
        >
          <div
            aria-hidden
            className="pointer-events-none absolute rounded-[50%]"
            style={{
              left: Z(130),
              top: z(192),
              width: Z(880),
              height: z(520),
              background:
                "radial-gradient(closest-side, rgba(40,94,133,0.20), rgba(200,225,242,0.08) 60%, transparent)",
            }}
          />
          {_e.map((p, x) => (
            <div
              key={p.key}
              aria-hidden
              className="pointer-events-none absolute rounded-[50%]"
              style={{
                left: Z(ee.cx - p.rx),
                top: z(ee.cy - p.ry),
                width: Z(p.rx * 2),
                height: z(p.ry * 2),
                border: x < 2 ? "1px solid rgba(40,94,133,0.26)" : "1px dashed rgba(40,94,133,0.20)",
              }}
            />
          ))}
          {gs.map(([p, x, T], Y) => (
            <span
              key={Y}
              aria-hidden
              className="pointer-events-none absolute rounded-full bg-[rgba(40,94,133,0.18)]"
              style={{
                left: Z(p),
                top: z(x),
                width: Z(T),
                aspectRatio: "1 / 1",
              }}
            />
          ))}
          {[3, 2, 1, 0].map((p, x) => (
            <div key={p}>
              <span
                aria-hidden
                className="pointer-events-none absolute w-px bg-[rgba(40,94,133,0.3)]"
                style={{
                  left: Z(569.5),
                  top: z(133 + x * 58),
                  height: z(9),
                }}
              />
              <div
                className="pointer-events-none absolute flex -translate-x-1/2 items-center gap-2 rounded-full border border-[rgba(23,50,77,0.1)] bg-white/90 px-2.5 py-1"
                style={{
                  left: "50%",
                  top: z(107 + x * 58),
                }}
              >
                <span
                  className={cn(
                    "h-[7px] w-[7px] shrink-0 rounded-full",
                    p <= 1 ? "bg-alma-accent-deep" : "bg-[rgba(23,50,77,0.25)]",
                  )}
                />
                <span className="whitespace-nowrap font-body text-[11px] text-[rgba(23,50,77,0.75)]">{ss(p, now)}</span>
                <span className="whitespace-nowrap font-body text-[11px] text-[rgba(23,50,77,0.45)]">
                  {f[p].toLocaleString()}
                </span>
              </div>
            </div>
          ))}
          <motion.div
            className="absolute inset-0"
            animate={{
              scale,
            }}
            transition={springSnappy}
            style={{
              transformOrigin: `${Z(ee.cx)} ${z(ee.cy)}`,
            }}
          >
            <div
              className="pointer-events-none absolute"
              style={{
                left: Z(490),
                top: z(328),
                width: Z(160),
                aspectRatio: "1 / 1",
              }}
            >
              <motion.span
                className="absolute inset-0 rounded-full"
                style={{
                  background: "radial-gradient(closest-side, rgba(40,94,133,0.35), transparent 70%)",
                }}
                animate={
                  m
                    ? undefined
                    : {
                        scale: [1, 1.06, 1],
                        opacity: [0.8, 1, 0.8],
                      }
                }
                transition={{
                  duration: 4.5,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
              <span className="absolute inset-[21%] rounded-full border-2 border-[rgba(40,94,133,0.55)]" />
              <span className="absolute inset-[32%] flex items-center justify-center rounded-full bg-gradient-to-br from-alma-accent-from to-alma-accent-deep">
                <span className="font-body text-[10px] font-semibold tracking-[0.08em] text-white">NOW</span>
              </span>
            </div>
            <div
              className="pointer-events-none absolute -translate-x-1/2 whitespace-nowrap rounded-full border border-[rgba(23,50,77,0.08)] bg-white/85 px-3 py-1 font-body text-[11px] text-[rgba(23,50,77,0.6)]"
              style={{
                left: "50%",
                top: z(492),
              }}
            >
              Today · {now.getDate()}{" "}
              {now.toLocaleDateString(undefined, {
                month: "short",
              })}{" "}
              {now.getFullYear()}
            </div>
            {k && (
              <span
                aria-hidden
                className="pointer-events-none absolute -translate-x-1/2 -translate-y-1/2 rounded-full"
                style={{
                  left: Z(k.x),
                  top: z(k.y),
                  width: Z(k.size * 1.9),
                  aspectRatio: "1 / 1",
                  background: "radial-gradient(closest-side, rgba(40,94,133,0.5), transparent 72%)",
                }}
              />
            )}
            {G.map((p) => {
              const x = hoveredId === p.item.id;
              return (
                <motion.button
                  key={p.item.id}
                  type="button"
                  layout
                  initial={{
                    opacity: 0,
                    scale: 0.6,
                  }}
                  animate={{
                    opacity: 1,
                    scale: x ? 1.12 : 1,
                  }}
                  transition={springPop}
                  onMouseEnter={(T) => onHover(p.item, T.currentTarget.getBoundingClientRect())}
                  onMouseLeave={() => onHover(null, null)}
                  onFocus={(T) => onHover(p.item, T.currentTarget.getBoundingClientRect())}
                  onBlur={() => onHover(null, null)}
                  onClick={() => {
                    if (!ORef.current) {
                      onOpen(p.item);
                    }
                  }}
                  aria-label={p.item.title}
                  className={cn(
                    "absolute -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-[16px] border-[3px] border-white",
                    "shadow-[0px_10px_26px_0px_rgba(23,50,77,0.16)]",
                    "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-alma-accent-ring",
                    x ? "z-20" : "z-10",
                  )}
                  style={{
                    left: Z(p.x),
                    top: z(p.y),
                    width: Z(p.size),
                    aspectRatio: "1 / 1",
                    opacity: 1 - p.ringIndex * 0.12,
                  }}
                >
                  <img src={p.item.url} alt="" loading="lazy" className="h-full w-full object-cover" />
                </motion.button>
              );
            })}
            <AnimatePresence>
              {j && k && (
                <motion.div
                  initial={{
                    opacity: 0,
                    y: 6,
                  }}
                  animate={{
                    opacity: 1,
                    y: 0,
                  }}
                  exit={{
                    opacity: 0,
                  }}
                  transition={springSnappy}
                  className="pointer-events-none absolute z-30 flex -translate-x-1/2 items-center gap-[7px] whitespace-nowrap rounded-full bg-gradient-to-r from-alma-accent-from to-alma-accent-to py-1.5 ps-2.5 pe-3 shadow-[0px_4px_12px_0px_rgba(40,94,133,0.18)]"
                  style={{
                    left: Z(k.x),
                    top: z(k.y + k.size * 0.62),
                  }}
                >
                  <span className="h-[7px] w-[7px] rounded-full bg-white" />
                  <span className="font-body text-[11px] font-medium tracking-[0.22px] text-white">{is(j, now)}</span>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
          <div
            className="absolute flex flex-col overflow-hidden rounded-[14px] border border-[rgba(23,50,77,0.11)] bg-white/90 shadow-[0px_3px_12px_0px_rgba(23,50,77,0.07)]"
            style={{
              right: Z(24),
              top: z(600),
            }}
          >
            <button
              type="button"
              aria-label={t_1("gallery.zoomIn")}
              onClick={() => setScale((p) => Math.min(Oe, p + 0.2))}
              className="flex size-10 items-center justify-center hover:bg-alma-panel/60"
            >
              <img src={iconPlus} alt="" className="h-[18px] w-[18px]" />
            </button>
            <button
              type="button"
              aria-label={t_1("gallery.zoomOut")}
              onClick={() => setScale((p) => Math.max(Ee, p - 0.2))}
              className="flex size-10 items-center justify-center border-t border-[rgba(23,50,77,0.09)] hover:bg-alma-panel/60"
            >
              <img src={iconMinus} alt="" className="h-[18px] w-[18px]" />
            </button>
          </div>
          <p
            className="pointer-events-none absolute hidden w-full text-center font-body text-xs text-[rgba(23,50,77,0.5)] sm:block"
            style={{
              top: z(724),
            }}
          >
            Drag to rotate · Scroll to zoom · Click a memory to open
          </p>
          {overlay && (
            <div
              className="pointer-events-none absolute inset-x-0 z-30 flex -translate-y-1/2 justify-center px-4"
              style={{
                top: z(ee.cy),
              }}
            >
              {overlay}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
const Ce = 96;
function Xs1Component({ items, now }) {
  const { t: t_1 } = useI18n();
  const r = React.useMemo(() => ns(items, now, Ce), [items, now]);
  const l = Math.max(1, ...r.map((n) => n.count));
  const a = React.useMemo(() => {
    if (r.length === 0) {
      return [];
    }
    const n = new Map();
    r.forEach((g, m) => {
      const N = g.startedAt.getFullYear();
      if (!n.has(N)) {
        n.set(N, m);
      }
    });
    return [...n.entries()].map(([year, m]) => ({
      year,
      index: m,
    }));
  }, [r]);
  const i = React.useMemo(() => {
    if (r.length === 0) {
      return null;
    }
    const n = new Date(now.getFullYear() - 1, 0, 1).getTime();
    const g = r.findIndex((m) => m.startedAt.getTime() >= n);
    if (g === -1) {
      return null;
    }
    return g;
  }, [r, now]);
  if (r.length === 0) {
    return (
      <div className="shrink-0 rounded-[18px] border border-[rgba(23,50,77,0.08)] bg-white/70 px-5 py-3">
        <div className="flex flex-wrap items-baseline gap-3">
          <span className="font-body text-[11px] font-medium tracking-[1.2px] text-[rgba(23,50,77,0.5)]">
            {t_1("gallery.timeline")}
          </span>
          <span className="font-body text-xs text-[rgba(23,50,77,0.45)]">{t_1("gallery.noTimeline")}</span>
        </div>
        <div className="mt-4 h-px w-full bg-[rgba(23,50,77,0.08)]" />
      </div>
    );
  }
  return (
    <div className="relative rounded-[18px] border border-[rgba(23,50,77,0.08)] bg-white/70 px-5 py-4">
      <div className="flex flex-wrap items-baseline gap-3">
        <span className="font-body text-[11px] font-medium tracking-[1.2px] text-[rgba(23,50,77,0.5)]">
          {t_1("gallery.timeline")}
        </span>
        <span className="font-body text-xs text-[rgba(23,50,77,0.5)]">
          {r[0].startedAt.toLocaleDateString(undefined, {
            month: "short",
            year: "numeric",
          })}{" "}
          –{" "}
          {now.toLocaleDateString(undefined, {
            month: "short",
            year: "numeric",
          })}
        </span>
        {i !== null && (
          <span className="ms-auto font-body text-[11px] font-medium tracking-[1.2px] text-[rgba(40,94,133,0.9)]">
            {t_1("gallery.inView")}
          </span>
        )}
      </div>
      <div className="relative mt-3">
        {i !== null && (
          <span
            aria-hidden
            className="absolute -top-1 bottom-4 rounded-[10px] border border-[rgba(40,94,133,0.35)] bg-[rgba(200,225,242,0.18)]"
            style={{
              left: `${(i / Ce) * 100}%`,
              right: 0,
            }}
          />
        )}
        <div className="relative flex h-[30px] items-end gap-[2px]">
          {r.map((n, g) => {
            const m = i !== null && g >= i;
            return (
              <span
                key={n.index}
                title={`${n.startedAt.toLocaleDateString(undefined, {
                  month: "short",
                  year: "numeric",
                })}: ${n.count}`}
                className={cn(
                  "min-w-0 flex-1 rounded-[2px]",
                  m ? "bg-[rgba(40,94,133,0.55)]" : "bg-[rgba(23,50,77,0.18)]",
                )}
                style={{
                  height: `${Math.max(8, (n.count / l) * 100)}%`,
                }}
              />
            );
          })}
        </div>
        <div className="mt-1 h-px w-full bg-[rgba(23,50,77,0.1)]" />
        <div className="relative mt-1 h-4">
          {a.map(({ year, index }) => (
            <span
              key={year}
              className="absolute font-body text-[11px] text-[rgba(23,50,77,0.45)]"
              style={{
                left: `${(index / Ce) * 100}%`,
              }}
            >
              {year}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
const iconUp2 =
  "data:image/svg+xml,%3csvg%20preserveAspectRatio='none'%20overflow='visible'%20style='display:%20block;'%20width='22'%20height='22'%20viewBox='0%200%2022%2022'%20fill='none'%20xmlns='http://www.w3.org/2000/svg'%3e%3cg%20id='icon/up'%3e%3cpath%20id='Vector'%20d='M19.25%2013.75V17.4167C19.25%2017.9029%2019.0568%2018.3692%2018.713%2018.713C18.3692%2019.0568%2017.9029%2019.25%2017.4167%2019.25H4.58333C4.0971%2019.25%203.63079%2019.0568%203.28697%2018.713C2.94315%2018.3692%202.75%2017.9029%202.75%2017.4167V13.75'%20stroke='%2317324d'%20stroke-opacity='0.95'%20stroke-width='1.2'%20stroke-linecap='round'%20stroke-linejoin='round'/%3e%3cpath%20id='Vector_2'%20d='M15.5833%207.33333L11%202.75L6.41667%207.33333'%20stroke='%2317324d'%20stroke-opacity='0.95'%20stroke-width='1.2'%20stroke-linecap='round'%20stroke-linejoin='round'/%3e%3cpath%20id='Vector_3'%20d='M11%202.75V14.6667'%20stroke='%2317324d'%20stroke-opacity='0.95'%20stroke-width='1.2'%20stroke-linecap='round'%20stroke-linejoin='round'/%3e%3c/g%3e%3c/svg%3e";
const iconUp3 =
  "data:image/svg+xml,%3csvg%20preserveAspectRatio='none'%20overflow='visible'%20style='display:%20block;'%20width='15'%20height='15'%20viewBox='0%200%2015%2015'%20fill='none'%20xmlns='http://www.w3.org/2000/svg'%3e%3cg%20id='icon/up'%3e%3cpath%20id='Vector'%20d='M13.125%209.375V11.875C13.125%2012.2065%2012.9933%2012.5245%2012.7589%2012.7589C12.5245%2012.9933%2012.2065%2013.125%2011.875%2013.125H3.125C2.79348%2013.125%202.47554%2012.9933%202.24112%2012.7589C2.0067%2012.5245%201.875%2012.2065%201.875%2011.875V9.375'%20stroke='%2317324d'%20stroke-opacity='0.9'%20stroke-width='1.2'%20stroke-linecap='round'%20stroke-linejoin='round'/%3e%3cpath%20id='Vector_2'%20d='M10.625%205L7.5%201.875L4.375%205'%20stroke='%2317324d'%20stroke-opacity='0.9'%20stroke-width='1.2'%20stroke-linecap='round'%20stroke-linejoin='round'/%3e%3cpath%20id='Vector_3'%20d='M7.5%201.875V10'%20stroke='%2317324d'%20stroke-opacity='0.9'%20stroke-width='1.2'%20stroke-linecap='round'%20stroke-linejoin='round'/%3e%3c/g%3e%3c/svg%3e";
const iconMsg =
  "data:image/svg+xml,%3csvg%20preserveAspectRatio='none'%20overflow='visible'%20style='display:%20block;'%20width='15'%20height='15'%20viewBox='0%200%2015%2015'%20fill='none'%20xmlns='http://www.w3.org/2000/svg'%3e%3cg%20id='icon/msg'%3e%3cpath%20id='Vector'%20d='M13.125%207.1875C13.1268%207.90966%2012.9797%208.62444%2012.6927%209.28714C12.4057%209.94984%2011.9851%2010.5462%2011.4572%2011.039C10.9292%2011.5317%2010.3053%2011.9102%209.62443%2012.1509C8.94354%2012.3915%208.22032%2012.4891%207.5%2012.4375C6.67541%2012.4369%205.86228%2012.2443%205.125%2011.875L1.875%2013.125L3.0625%209.9375C2.55864%209.14332%202.27739%208.22836%202.24813%207.28828C2.21888%206.3482%202.44271%205.41753%202.89621%204.59356C3.34972%203.76958%204.01625%203.08257%204.82612%202.60433C5.63599%202.1261%206.55947%201.87421%207.5%201.875C8.22561%201.82296%208.95412%201.92229%209.63932%202.16669C10.3245%202.41109%2010.9514%202.79523%2011.4803%203.29473C12.0092%203.79423%2012.4285%204.3982%2012.7116%205.06833C12.9948%205.73845%2013.1355%206.4601%2013.125%207.1875Z'%20stroke='%2317324d'%20stroke-opacity='0.7'%20stroke-width='1.2'%20stroke-linecap='round'%20stroke-linejoin='round'/%3e%3c/g%3e%3c/svg%3e";
function Ys1Component({ onUpload, onLinkWhatsApp }) {
  const { t: t_1 } = useI18n();
  return (
    <motion.div
      initial={{
        opacity: 0,
        scale: 0.92,
        y: 14,
      }}
      animate={{
        opacity: 1,
        scale: 1,
        y: 0,
      }}
      transition={springPop}
      className="pointer-events-auto flex w-full max-w-[500px] flex-col items-center gap-3 rounded-[24px] border border-[rgba(23,50,77,0.1)] bg-white/[0.96] px-7 pb-[22px] pt-[26px] text-center shadow-[0px_14px_38px_0px_rgba(23,50,77,0.1)]"
    >
      <span
        className="flex size-[52px] items-center justify-center rounded-full"
        style={{
          backgroundImage: "linear-gradient(135deg, #285e85 0%, #2f6e99 71.429%)",
        }}
      >
        <img src={iconUp2} alt="" className="h-[22px] w-[22px]" />
      </span>
      <h2 className="font-display text-2xl font-semibold tracking-[0.24px] text-alma-ink">
        {t_1("gallery.orbitEmpty")}
      </h2>
      <p className="font-body text-[13.5px] leading-[21px] tracking-[0.135px] text-[rgba(23,50,77,0.65)]">
        Upload a few photos, or forward them to ALMA on WhatsApp. They start beside you and drift outward as time
        passes.
      </p>
      <div className="mt-1 flex flex-wrap items-center justify-center gap-2.5">
        <button
          type="button"
          onClick={onUpload}
          className="flex items-center gap-2 rounded-full bg-gradient-to-r from-alma-accent-from to-alma-accent-to py-3 ps-[18px] pe-5 font-body text-[13px] font-medium tracking-[0.26px] text-white shadow-[0px_4px_12px_0px_rgba(40,94,133,0.16)] transition-opacity hover:opacity-90"
        >
          <img src={iconUp3} alt="" className="brightness-0 invert h-[15px] w-[15px]" />
          {t_1("gallery.uploadPhotos")}
        </button>
        <button
          type="button"
          onClick={onLinkWhatsApp}
          className="flex items-center gap-2 rounded-full border border-[rgba(23,50,77,0.16)] bg-white py-3 ps-[18px] pe-5 font-body text-[13px] font-medium tracking-[0.26px] text-[rgba(23,50,77,0.85)] transition-colors hover:bg-alma-panel/50"
        >
          <img src={iconMsg} alt="" className="h-[15px] w-[15px]" />
          {t_1("wa.link")}
        </button>
      </div>
    </motion.div>
  );
}
function Ke1Component({ active, onToggle, size = "md", className }) {
  const l = size === "sm" ? "size-8" : "size-[38px]";
  const a = size === "sm" ? "h-3.5 w-3.5" : "h-4 w-4";
  return (
    <motion.button
      type="button"
      onClick={(i) => {
        i.stopPropagation();
        onToggle();
      }}
      aria-pressed={active}
      aria-label={active ? "Remove from favourites" : "Add to favourites"}
      title={active ? "Remove from favourites" : "Add to favourites"}
      whileTap={{
        scale: 0.86,
      }}
      animate={
        active
          ? {
              scale: [1, 1.32, 1],
            }
          : {
              scale: 1,
            }
      }
      transition={springPop}
      className={cn(
        "flex shrink-0 items-center justify-center rounded-full border transition-colors",
        "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-alma-accent-ring",
        l,
        active
          ? "border-[rgba(40,94,133,0.35)] bg-alma-panel"
          : "border-[rgba(23,50,77,0.1)] bg-[#eaf3fa] hover:bg-white",
        className,
      )}
    >
      <img
        src={iconStarOutline}
        alt=""
        className={cn(a, active && "brightness-0 saturate-100")}
        style={
          active
            ? {
                filter: "brightness(0) saturate(100%) invert(22%) sepia(38%) saturate(1200%) hue-rotate(96deg)",
              }
            : undefined
        }
      />
    </motion.button>
  );
}
const iconPin2 =
  "data:image/svg+xml,%3csvg%20preserveAspectRatio='none'%20overflow='visible'%20style='display:%20block;'%20width='16'%20height='16'%20viewBox='0%200%2016%2016'%20fill='none'%20xmlns='http://www.w3.org/2000/svg'%3e%3cg%20id='icon/pin'%3e%3cpath%20id='Vector'%20d='M13.3333%206.66667C13.3333%2010.6667%208%2014.6667%208%2014.6667C8%2014.6667%202.66667%2010.6667%202.66667%206.66667C2.66667%205.25218%203.22857%203.89562%204.22876%202.89543C5.22896%201.89524%206.58551%201.33333%208%201.33333C9.41449%201.33333%2010.771%201.89524%2011.7712%202.89543C12.7714%203.89562%2013.3333%205.25218%2013.3333%206.66667Z'%20stroke='%2317324d'%20stroke-opacity='0.55'%20stroke-width='1.2'%20stroke-linecap='round'%20stroke-linejoin='round'/%3e%3cpath%20id='Vector_2'%20d='M8%208.66667C9.10457%208.66667%2010%207.77124%2010%206.66667C10%205.5621%209.10457%204.66667%208%204.66667C6.89543%204.66667%206%205.5621%206%206.66667C6%207.77124%206.89543%208.66667%208%208.66667Z'%20stroke='%2317324d'%20stroke-opacity='0.55'%20stroke-width='1.2'%20stroke-linecap='round'%20stroke-linejoin='round'/%3e%3c/g%3e%3c/svg%3e";
const iconUsers2 =
  "data:image/svg+xml,%3csvg%20preserveAspectRatio='none'%20overflow='visible'%20style='display:%20block;'%20width='16'%20height='16'%20viewBox='0%200%2016%2016'%20fill='none'%20xmlns='http://www.w3.org/2000/svg'%3e%3cg%20id='icon/users'%3e%3cpath%20id='Vector'%20d='M10.6667%2014V12.6667C10.6667%2011.9594%2010.3857%2011.2811%209.88562%2010.781C9.38552%2010.281%208.70724%2010%208%2010H4C3.29276%2010%202.61448%2010.281%202.11438%2010.781C1.61428%2011.2811%201.33333%2011.9594%201.33333%2012.6667V14'%20stroke='%2317324d'%20stroke-opacity='0.55'%20stroke-width='1.2'%20stroke-linecap='round'%20stroke-linejoin='round'/%3e%3cpath%20id='Vector_2'%20d='M6%207.33333C7.47276%207.33333%208.66667%206.13943%208.66667%204.66667C8.66667%203.19391%207.47276%202%206%202C4.52724%202%203.33333%203.19391%203.33333%204.66667C3.33333%206.13943%204.52724%207.33333%206%207.33333Z'%20stroke='%2317324d'%20stroke-opacity='0.55'%20stroke-width='1.2'%20stroke-linecap='round'%20stroke-linejoin='round'/%3e%3cpath%20id='Vector_3'%20d='M14.6667%2014V12.6667C14.6707%2012.0724%2014.4761%2011.4938%2014.1137%2011.0228C13.7514%2010.5517%2013.2421%2010.2152%2012.6667%2010.0667'%20stroke='%2317324d'%20stroke-opacity='0.55'%20stroke-width='1.2'%20stroke-linecap='round'%20stroke-linejoin='round'/%3e%3c/g%3e%3c/svg%3e";
const iconSpark =
  "data:image/svg+xml,%3csvg%20preserveAspectRatio='none'%20overflow='visible'%20style='display:%20block;'%20width='13'%20height='13'%20viewBox='0%200%2013%2013'%20fill='none'%20xmlns='http://www.w3.org/2000/svg'%3e%3cg%20id='icon/spark'%3e%3cpath%20id='Vector'%20d='M6.5%201.625V3.79167M6.5%209.20833V11.375M1.625%206.5H3.79167M9.20833%206.5H11.375M3.25%203.25L4.60417%204.60417M8.39583%208.39583L9.75%209.75M9.75%203.25L8.39583%204.60417M4.60417%208.39583L3.25%209.75'%20stroke='%23285e85'%20stroke-opacity='0.9'%20stroke-width='1.2'%20stroke-linecap='round'%20stroke-linejoin='round'/%3e%3c/g%3e%3c/svg%3e";
const iconArrow =
  "data:image/svg+xml,%3csvg%20preserveAspectRatio='none'%20overflow='visible'%20style='display:%20block;'%20width='14'%20height='14'%20viewBox='0%200%2014%2014'%20fill='none'%20xmlns='http://www.w3.org/2000/svg'%3e%3cg%20id='icon/arrow'%3e%3cpath%20id='Vector'%20d='M2.91667%207H11.0833M7.58333%2010.5L11.0833%207L7.58333%203.5'%20stroke='%2317324d'%20stroke-opacity='0.9'%20stroke-width='1.2'%20stroke-linecap='round'%20stroke-linejoin='round'/%3e%3c/g%3e%3c/svg%3e";
const iconShare =
  "data:image/svg+xml,%3csvg%20preserveAspectRatio='none'%20overflow='visible'%20style='display:%20block;'%20width='16'%20height='16'%20viewBox='0%200%2016%2016'%20fill='none'%20xmlns='http://www.w3.org/2000/svg'%3e%3cg%20id='icon/share'%3e%3cpath%20id='Vector'%20d='M12%205.33333C13.1046%205.33333%2014%204.4379%2014%203.33333C14%202.22876%2013.1046%201.33333%2012%201.33333C10.8954%201.33333%2010%202.22876%2010%203.33333C10%204.4379%2010.8954%205.33333%2012%205.33333Z'%20stroke='%2317324d'%20stroke-opacity='0.6'%20stroke-width='1.2'%20stroke-linecap='round'%20stroke-linejoin='round'/%3e%3cpath%20id='Vector_2'%20d='M4%2010C5.10457%2010%206%209.10457%206%208C6%206.89543%205.10457%206%204%206C2.89543%206%202%206.89543%202%208C2%209.10457%202.89543%2010%204%2010Z'%20stroke='%2317324d'%20stroke-opacity='0.6'%20stroke-width='1.2'%20stroke-linecap='round'%20stroke-linejoin='round'/%3e%3cpath%20id='Vector_3'%20d='M12%2014.6667C13.1046%2014.6667%2014%2013.7712%2014%2012.6667C14%2011.5621%2013.1046%2010.6667%2012%2010.6667C10.8954%2010.6667%2010%2011.5621%2010%2012.6667C10%2013.7712%2010.8954%2014.6667%2012%2014.6667Z'%20stroke='%2317324d'%20stroke-opacity='0.6'%20stroke-width='1.2'%20stroke-linecap='round'%20stroke-linejoin='round'/%3e%3cpath%20id='Vector_4'%20d='M5.73333%209L10.2667%2011.6667M10.2667%204.33333L5.73333%207'%20stroke='%2317324d'%20stroke-opacity='0.6'%20stroke-width='1.2'%20stroke-linecap='round'%20stroke-linejoin='round'/%3e%3c/g%3e%3c/svg%3e";
function js(takenAt) {
  const s = new Date(takenAt);
  if (Number.isNaN(s.getTime())) {
    return "";
  }
  return `${s.toLocaleDateString(undefined, {
    weekday: "long",
    day: "numeric",
    month: "short",
    year: "numeric",
  })}  ·  ${s.toLocaleTimeString(undefined, {
    hour: "numeric",
    minute: "2-digit",
  })}`;
}
function Ns(people) {
  if (people.length === 0) {
    return null;
  }
  if (people.length === 1) {
    return `With ${people[0]}`;
  }
  if (people.length === 2) {
    return `With ${people[0]} and ${people[1]}`;
  }
  return `With ${people[0]}, ${people[1]} and ${people.length - 2} more`;
}
function CsComponent({
  item,
  facts,
  style,
  onOpen,
  onShare,
  isFavourite,
  onToggleFavourite,
  onPointerEnter,
  onPointerLeave,
}) {
  const { t: t_1 } = useI18n();
  const N = facts.places[0] ?? null;
  const _ = Ns(facts.people);
  return (
    <motion.div
      {...popInVariants}
      transition={springSnappy}
      style={style}
      onPointerEnter={onPointerEnter}
      onPointerLeave={onPointerLeave}
      className="pointer-events-auto z-40 flex w-[280px] flex-col gap-2.5 rounded-[20px] border border-[rgba(23,50,77,0.1)] bg-white/[0.97] px-[18px] pb-4 pt-[18px] shadow-[0px_2px_6px_0px_rgba(23,50,77,0.07),0px_16px_40px_0px_rgba(23,50,77,0.16)]"
    >
      <div className="flex flex-col gap-[5px]">
        <p className="font-display text-[17px] font-semibold tracking-[0.17px] text-alma-ink">{item.title}</p>
        <p className="font-body text-[11px] tracking-[0.22px] text-[rgba(23,50,77,0.55)]">{js(item.takenAt)}</p>
      </div>
      {(N || _) && (
        <>
          <div className="h-px w-full bg-[rgba(23,50,77,0.09)]" />
          <div className="flex flex-col gap-2">
            {N && (
              <div className="flex items-center gap-[9px]">
                <img src={iconPin2} alt="" className="h-4 w-4 shrink-0" />
                <span className="truncate font-body text-xs tracking-[0.24px] text-[rgba(23,50,77,0.8)]">{N}</span>
              </div>
            )}
            {_ && (
              <div className="flex items-center gap-[9px]">
                <img src={iconUsers2} alt="" className="h-4 w-4 shrink-0" />
                <span className="truncate font-body text-xs tracking-[0.24px] text-[rgba(23,50,77,0.8)]">{_}</span>
              </div>
            )}
          </div>
        </>
      )}
      {item.tags.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {item.tags.slice(0, 3).map((F) => (
            <span
              key={F}
              className="rounded-full border border-[rgba(23,50,77,0.1)] bg-[#eaf3fa] px-2.5 py-[5px] font-body text-[11px] font-medium tracking-[0.22px] text-[rgba(23,50,77,0.75)]"
            >
              {F}
            </span>
          ))}
        </div>
      )}
      {facts.revisits > 0 && (
        <div className="flex flex-col gap-[5px] rounded-[12px] border border-[rgba(40,94,133,0.16)] bg-[#eaf3fa] px-3 pb-[13px] pt-3">
          <div className="flex items-center gap-1.5">
            <img src={iconSpark} alt="" className="h-[13px] w-[13px]" />
            <span className="font-body text-[10px] font-semibold tracking-[1px] text-[rgba(23,50,77,0.85)]">ALMA</span>
          </div>
          <p className="font-body text-[11.5px] leading-[17px] tracking-[0.115px] text-[rgba(23,50,77,0.85)]">
            You’ve come back to this one {facts.revisits} {facts.revisits === 1 ? "time" : "times"}.
          </p>
        </div>
      )}
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={onOpen}
          className="flex items-center gap-[7px] rounded-full bg-gradient-to-r from-alma-accent-from to-alma-accent-to py-[9px] ps-4 pe-3.5 font-body text-xs font-medium text-white shadow-[0px_4px_12px_0px_rgba(40,94,133,0.16)] transition-opacity hover:opacity-90"
        >
          {t_1("gallery.openMemory")}
          <img src={iconArrow} alt="" className="rtl:-scale-x-100 brightness-0 invert h-3.5 w-3.5" />
        </button>
        <span className="flex-1" />
        <Ke1Component active={isFavourite} onToggle={onToggleFavourite} size="sm" />
        <button
          type="button"
          onClick={onShare}
          aria-label={t_1("gallery.copyLink")}
          className="flex size-[34px] items-center justify-center rounded-full border border-[rgba(23,50,77,0.1)] bg-[#eaf3fa] transition-colors hover:bg-white"
        >
          <img src={iconShare} alt="" className="h-4 w-4" />
        </button>
      </div>
    </motion.div>
  );
}
const iconClose =
  "data:image/svg+xml,%3csvg%20preserveAspectRatio='none'%20overflow='visible'%20style='display:%20block;'%20width='16'%20height='16'%20viewBox='0%200%2016%2016'%20fill='none'%20xmlns='http://www.w3.org/2000/svg'%3e%3cg%20id='icon/close'%3e%3cpath%20id='Vector'%20d='M12%204L4%2012M4%204L12%2012'%20stroke='%2317324d'%20stroke-opacity='0.65'%20stroke-width='1.2'%20stroke-linecap='round'%20stroke-linejoin='round'/%3e%3c/g%3e%3c/svg%3e";
const iconRight =
  "data:image/svg+xml,%3csvg%20preserveAspectRatio='none'%20overflow='visible'%20style='display:%20block;'%20width='16'%20height='16'%20viewBox='0%200%2016%2016'%20fill='none'%20xmlns='http://www.w3.org/2000/svg'%3e%3cg%20id='icon/right'%3e%3cpath%20id='Vector'%20d='M6%2012L10%208L6%204'%20stroke='%2317324d'%20stroke-opacity='0.65'%20stroke-width='1.2'%20stroke-linecap='round'%20stroke-linejoin='round'/%3e%3c/g%3e%3c/svg%3e";
const iconClock2 =
  "data:image/svg+xml,%3csvg%20preserveAspectRatio='none'%20overflow='visible'%20style='display:%20block;'%20width='14'%20height='14'%20viewBox='0%200%2014%2014'%20fill='none'%20xmlns='http://www.w3.org/2000/svg'%3e%3cg%20id='icon/clock'%3e%3cpath%20id='Vector'%20d='M7%2012.25C9.89949%2012.25%2012.25%209.89949%2012.25%207C12.25%204.1005%209.89949%201.75%207%201.75C4.1005%201.75%201.75%204.1005%201.75%207C1.75%209.89949%204.1005%2012.25%207%2012.25Z'%20stroke='%2317324d'%20stroke-opacity='0.45'%20stroke-width='1.2'%20stroke-linecap='round'%20stroke-linejoin='round'/%3e%3cpath%20id='Vector_2'%20d='M7%204.08333V7L8.75%208.16667'%20stroke='%2317324d'%20stroke-opacity='0.45'%20stroke-width='1.2'%20stroke-linecap='round'%20stroke-linejoin='round'/%3e%3c/g%3e%3c/svg%3e";
const iconBook =
  "data:image/svg+xml,%3csvg%20preserveAspectRatio='none'%20overflow='visible'%20style='display:%20block;'%20width='15'%20height='15'%20viewBox='0%200%2015%2015'%20fill='none'%20xmlns='http://www.w3.org/2000/svg'%3e%3cg%20id='icon/book'%3e%3cpath%20id='Vector'%20d='M2.5%2012.1875C2.5%2011.7731%202.66462%2011.3757%202.95765%2011.0826C3.25067%2010.7896%203.6481%2010.625%204.0625%2010.625H12.5'%20stroke='%2317324d'%20stroke-opacity='0.9'%20stroke-width='1.2'%20stroke-linecap='round'%20stroke-linejoin='round'/%3e%3cpath%20id='Vector_2'%20d='M4.0625%201.25H12.5V13.75H4.0625C3.6481%2013.75%203.25067%2013.5854%202.95765%2013.2924C2.66462%2012.9993%202.5%2012.6019%202.5%2012.1875V2.8125C2.5%202.3981%202.66462%202.00067%202.95765%201.70765C3.25067%201.41462%203.6481%201.25%204.0625%201.25Z'%20stroke='%2317324d'%20stroke-opacity='0.9'%20stroke-width='1.2'%20stroke-linecap='round'%20stroke-linejoin='round'/%3e%3c/g%3e%3c/svg%3e";
const ze = [
  {
    bg: "#dcefff",
    fg: "#2f6fb0",
  },
  {
    bg: "#ffe9dc",
    fg: "#b06a2f",
  },
  {
    bg: "#e6ddff",
    fg: "#5b4bb0",
  },
  {
    bg: "#dbf6e3",
    fg: "#2f8f57",
  },
];
function As(t) {
  let s = 0;
  for (let o = 0; o < t.length; o++) {
    s += t.charCodeAt(o);
  }
  return ze[s % ze.length];
}
function Ss(takenAt) {
  const s = new Date(takenAt);
  if (Number.isNaN(s.getTime())) {
    return "";
  }
  return `${s.toLocaleDateString(undefined, {
    weekday: "long",
    day: "numeric",
    month: "short",
    year: "numeric",
  })} · ${s.toLocaleTimeString(undefined, {
    hour: "numeric",
    minute: "2-digit",
  })}`;
}
const className =
  "flex size-[34px] shrink-0 items-center justify-center rounded-full border border-[rgba(23,50,77,0.1)] bg-[#eaf3fa] transition-colors hover:bg-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-alma-accent-ring disabled:opacity-40";
function VsComponent({
  item,
  facts,
  index,
  total,
  related,
  onClose,
  onPrev,
  onNext,
  onOpenRelated,
  onAddToVault,
  onShare,
  isFavourite,
  onToggleFavourite,
}) {
  const { t: t_1 } = useI18n();
  React.useEffect(() => {
    const y = (w) => {
      if (w.key === "Escape") {
        onClose();
      }
      if (w.key === "ArrowLeft") {
        onPrev();
      }
      if (w.key === "ArrowRight") {
        onNext();
      }
    };
    window.addEventListener("keydown", y);
    return () => window.removeEventListener("keydown", y);
  }, [onClose, onPrev, onNext]);
  return (
    <>
      <motion.button
        type="button"
        aria-label={t_1("gallery.closeMemory")}
        onClick={onClose}
        initial={{
          opacity: 0,
        }}
        animate={{
          opacity: 1,
        }}
        exit={{
          opacity: 0,
        }}
        transition={fadeQuick}
        className="fixed inset-0 z-40 cursor-default bg-gradient-to-r from-[rgba(246,249,252,0.3)] to-[rgba(246,249,252,0.62)] backdrop-blur-[4.5px] sm:absolute"
      />
      <motion.div
        role="dialog"
        aria-modal="true"
        aria-label={item.title}
        initial={{
          opacity: 0,
          scale: 0.88,
          x: 28,
        }}
        animate={{
          opacity: 1,
          scale: 1,
          x: 0,
        }}
        exit={{
          opacity: 0,
          scale: 0.92,
          x: 16,
        }}
        transition={springPop}
        className={cn(
          "fixed inset-3 z-50 flex flex-col gap-3.5",
          "sm:absolute sm:inset-auto sm:end-3 sm:top-3 sm:max-h-[calc(100%-1.5rem)] sm:w-[min(460px,calc(100%-1.5rem))]",
          "overflow-y-auto rounded-[24px] border border-[rgba(23,50,77,0.1)] bg-white/[0.99] p-5",
          "shadow-[-8px_20px_56px_0px_rgba(23,50,77,0.18)]",
        )}
      >
        <div className="flex items-center gap-2">
          <button type="button" onClick={onClose} aria-label={t_1("action.close")} className={className}>
            <img src={iconClose} alt="" className="h-4 w-4" />
          </button>
          <span className="flex-1" />
          <p className="font-body text-[11px] tracking-[0.22px] text-[rgba(23,50,77,0.5)]">
            Memory {index} of {total} in view
          </p>
          <button
            type="button"
            onClick={onPrev}
            disabled={total < 2}
            aria-label={t_1("gallery.prevMemory")}
            className={className}
          >
            <img src={iconChevronLeft} alt="" className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={onNext}
            disabled={total < 2}
            aria-label={t_1("gallery.nextMemory")}
            className={className}
          >
            <img src={iconRight} alt="" className="h-4 w-4" />
          </button>
        </div>
        <motion.img
          key={item.id}
          src={item.url}
          alt={item.title}
          initial={{
            opacity: 0,
            scale: 0.97,
          }}
          animate={{
            opacity: 1,
            scale: 1,
          }}
          transition={springPop}
          className="h-[240px] w-full rounded-[16px] object-cover"
        />
        <div className="flex flex-col gap-2.5">
          <h2 className="font-display text-2xl font-semibold tracking-[0.24px] text-alma-ink">{item.title}</h2>
          <div className="flex flex-wrap items-center gap-4">
            <span className="flex items-center gap-[7px]">
              <img src={iconClock2} alt="" className="h-3.5 w-3.5" />
              <span className="font-body text-[11.5px] tracking-[0.23px] text-[rgba(23,50,77,0.62)]">
                {Ss(item.takenAt)}
              </span>
            </span>
            {facts.places[0] && (
              <span className="flex items-center gap-[7px]">
                <img src={iconPin2} alt="" className="h-3.5 w-3.5" />
                <span className="font-body text-[11.5px] tracking-[0.23px] text-[rgba(23,50,77,0.62)]">
                  {facts.places[0]}
                </span>
              </span>
            )}
          </div>
        </div>
        {item.caption && (
          <div className="flex flex-col gap-[7px] rounded-[14px] border border-[rgba(40,94,133,0.15)] bg-[#eaf3fa] px-[15px] py-3.5">
            <p className="font-body text-[9.5px] font-semibold tracking-[1.14px] text-[rgba(23,50,77,0.7)]">
              {t_1("gallery.whatYouTold")}
            </p>
            <p className="font-body text-[13px] leading-[1.5] tracking-[0.13px] text-[rgba(23,50,77,0.9)]">
              {item.caption}
            </p>
          </div>
        )}
        {item.tags.length > 0 && (
          <div className="flex flex-wrap gap-[7px]">
            {item.tags.map((y) => (
              <span
                key={y}
                className="rounded-full border border-[rgba(23,50,77,0.1)] bg-[#eaf3fa] px-[11px] py-1.5 font-body text-[11px] font-medium tracking-[0.22px] text-[rgba(23,50,77,0.75)]"
              >
                {y}
              </span>
            ))}
          </div>
        )}
        {facts.people.length > 0 && (
          <div className="flex flex-col gap-2.5">
            <p className="font-body text-[10px] font-medium tracking-[1.2px] text-[rgba(23,50,77,0.45)]">
              {t_1("gallery.peopleIn")}
            </p>
            <div className="flex flex-wrap items-center gap-2">
              {facts.people.slice(0, 3).map((y) => {
                const w = As(y);
                return (
                  <span
                    key={y}
                    className="flex items-center gap-2 rounded-full border border-[rgba(23,50,77,0.1)] bg-white py-[5px] ps-[5px] pe-[13px]"
                  >
                    <span
                      className="flex size-[26px] items-center justify-center rounded-full font-body text-[11px] font-semibold"
                      style={{
                        backgroundColor: w.bg,
                        color: w.fg,
                      }}
                    >
                      {y.charAt(0).toUpperCase()}
                    </span>
                    <span className="font-body text-[11.5px] font-medium tracking-[0.23px] text-[rgba(23,50,77,0.8)]">
                      {y}
                    </span>
                  </span>
                );
              })}
              {facts.people.length > 3 && (
                <span className="font-body text-[11px] tracking-[0.22px] text-[rgba(23,50,77,0.45)]">
                  +{facts.people.length - 3} more
                </span>
              )}
            </div>
          </div>
        )}
        {related.length > 0 && (
          <div className="flex flex-col gap-2.5">
            <div className="flex items-center gap-2">
              <p className="font-body text-[10px] font-medium tracking-[1.2px] text-[rgba(23,50,77,0.45)]">
                {t_1("gallery.related")}
              </p>
              <span className="flex-1" />
              {item.tags[0] && (
                <p className="font-body text-[10.5px] tracking-[0.21px] text-[rgba(40,94,133,0.9)]">
                  Also tagged {item.tags[0]}
                </p>
              )}
            </div>
            <div className="flex gap-3">
              {related.slice(0, 4).map((y) => (
                <button
                  key={y.id}
                  type="button"
                  onClick={() => onOpenRelated(y)}
                  aria-label={`Open ${y.title}`}
                  className="h-[88px] min-w-0 flex-1 overflow-hidden rounded-[14px] border-2 border-white transition-transform hover:scale-[1.03] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-alma-accent-ring"
                >
                  <img src={y.url} alt="" loading="lazy" className="h-full w-full object-cover" />
                </button>
              ))}
            </div>
          </div>
        )}
        <div className="h-px w-full bg-[rgba(23,50,77,0.09)]" />
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onAddToVault}
            className="flex items-center gap-2 rounded-full bg-gradient-to-r from-alma-accent-from to-alma-accent-to py-[11px] ps-4 pe-[18px] font-body text-[12.5px] font-medium tracking-[0.25px] text-white shadow-[0px_4px_12px_0px_rgba(40,94,133,0.16)] transition-opacity hover:opacity-90"
          >
            <img src={iconBook} alt="" className="brightness-0 invert h-[15px] w-[15px]" />
            {t_1("vault.addTo")}
          </button>
          <span className="flex-1" />
          <Ke1Component active={isFavourite} onToggle={onToggleFavourite} />
          <button
            type="button"
            onClick={onShare}
            aria-label={t_1("gallery.copyLink")}
            className="flex size-[38px] items-center justify-center rounded-full border border-[rgba(23,50,77,0.1)] bg-[#eaf3fa] transition-colors hover:bg-white"
          >
            <img src={iconShare} alt="" className="h-4 w-4" />
          </button>
          <a
            href={item.url}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={t_1("gallery.openOriginal")}
            className="flex size-[38px] items-center justify-center rounded-full border border-[rgba(23,50,77,0.1)] bg-[#eaf3fa] transition-colors hover:bg-white"
          >
            <img src={iconRight} alt="" className="h-4 w-4" />
          </a>
        </div>
      </motion.div>
    </>
  );
}
const Ls = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const Ts = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];
const Rs = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];
const Ds = 86400000;
function Pe(t) {
  return new Date(t.getFullYear(), t.getMonth(), t.getDate()).getTime();
}
function Xe(t, s) {
  const o = new Map();
  for (const r of t) {
    const at = new Date(r.takenAt);
    if (Number.isNaN(at.getTime())) {
      continue;
    }
    const a = `${at.getFullYear()}-${at.getMonth()}-${at.getDate()}`;
    const i = o.get(a);
    if (i) {
      i.items.push(r);
    } else {
      o.set(a, {
        at,
        items: [r],
      });
    }
  }
  return [...o.entries()]
    .sort((r, l) => l[1].at.getTime() - r[1].at.getTime())
    .map(([r, { at, items }]) => {
      const i = Math.round((Pe(s) - Pe(at)) / Ds);
      const heading = i === 0 ? "Today" : i === 1 ? "Yesterday" : Ls[at.getDay()];
      return {
        key: r,
        heading,
        dateLabel: `${at.getDate()} ${Ts[at.getMonth()]} ${at.getFullYear()}`,
        count: items.length,
        items: [...items].sort((g, m) => new Date(m.takenAt).getTime() - new Date(g.takenAt).getTime()),
      };
    });
}
function Fs(items, now) {
  const o = new Set();
  const r = new Set();
  for (const i of items) {
    const n = new Date(i.takenAt);
    if (!Number.isNaN(n.getTime())) {
      if (n.getFullYear() === now.getFullYear()) {
        o.add(`${n.getFullYear()}-${n.getMonth()}`);
      } else {
        r.add(n.getFullYear());
      }
    }
  }
  const l = [...o]
    .map((i) => {
      const [n, g] = i.split("-").map(Number);
      return {
        key: i,
        label: Rs[g],
        jumpToKey: i,
        sort: n * 12 + g,
      };
    })
    .sort((i, n) => n.sort - i.sort)
    .map(({ key, label, jumpToKey }) => ({
      key,
      label,
      jumpToKey,
    }));
  const a = [...r]
    .sort((i, n) => n - i)
    .map((i) => ({
      key: `y-${i}`,
      label: `'${String(i).slice(-2)}`,
      jumpToKey: `y-${i}`,
    }));
  return [...l, ...a];
}
function He(key, now) {
  const [o, r] = key.split("-").map(Number);
  if (o === now.getFullYear()) {
    return `${o}-${r}`;
  }
  return `y-${o}`;
}
function Ye(items, now) {
  const o = Xe(items, now);
  const t_length = items.length;
  const o_length = o.length;
  if (t_length === 0) {
    return "No photos yet";
  }
  return `${t_length.toLocaleString()} ${t_length === 1 ? "photo" : "photos"} across ${o_length} ${o_length === 1 ? "day" : "days"}`;
}
function IsComponent({ items, now, onOpen, favourites, onToggleFavourite }) {
  const a = React.useMemo(() => Xe(items, now), [items, now]);
  const i = React.useMemo(() => Fs(items, now), [items, now]);
  const [n, setN] = React.useState(null);
  const mRef = React.useRef(new Map());
  const NRef = React.useRef(null);
  React.useEffect(() => {
    if (!n && i.length > 0) {
      setN(i[0].key);
    }
  }, [i, n]);
  const onScroll = React.useCallback(() => {
    const NRef_current = NRef.current;
    if (!NRef_current) {
      return;
    }
    const top = NRef_current.getBoundingClientRect().top;
    let w = null;
    for (const P of a) {
      const C = mRef.current.get(P.key);
      if (C && C.getBoundingClientRect().top - top <= 24) {
        w = He(P.key, now);
      }
    }
    if (w) {
      setN(w);
    }
  }, [a, now]);
  const F = (key) => {
    var w;
    const y = a.find((P) => He(P.key, now) === key);
    if (y) {
      if ((w = mRef.current.get(y.key)) != null) {
        w.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }
      setN(key);
    }
  };
  if (a.length === 0) {
    return (
      <p className="py-20 text-center font-body text-sm text-[rgba(23,50,77,0.45)]">
        Nothing here yet. Upload a few photos and they will stack up by day.
      </p>
    );
  }
  return (
    <div className="relative flex min-h-0 flex-1 gap-4">
      <div ref={NRef} onScroll={onScroll} className="min-w-0 flex-1 overflow-y-auto pb-10 pe-2">
        {a.map((h, y) => (
          <div
            key={h.key}
            ref={(w) => {
              if (w) {
                mRef.current.set(h.key, w);
              } else {
                mRef.current.delete(h.key);
              }
            }}
            className="flex flex-col gap-4 border-s border-[rgba(23,50,77,0.1)] pb-10 ps-6 sm:flex-row sm:gap-8 sm:border-s-0 sm:ps-0"
          >
            <div className="relative w-full shrink-0 sm:w-[180px]">
              <span
                aria-hidden
                className={cn(
                  "absolute -start-[27px] top-2 size-2 rounded-full sm:hidden",
                  y === 0 ? "bg-alma-accent-deep" : "bg-[rgba(23,50,77,0.2)]",
                )}
              />
              <h2 className="font-display text-base font-semibold tracking-[0.16px] text-alma-ink">{h.heading}</h2>
              <p className="mt-1 font-body text-[13px] text-[rgba(23,50,77,0.6)]">{h.dateLabel}</p>
              <p className="mt-0.5 font-body text-xs text-[rgba(23,50,77,0.45)]">
                {h.count} {h.count === 1 ? "photo" : "photos"}
              </p>
            </div>
            <div className="hidden w-px shrink-0 self-stretch bg-[rgba(23,50,77,0.1)] sm:block" />
            <div className="grid min-w-0 flex-1 grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
              {h.items.map((w) => (
                <div key={w.id} className="group/tile relative">
                  <motion.button
                    type="button"
                    onClick={() => onOpen(w)}
                    aria-label={w.title}
                    whileHover={{
                      scale: 1.04,
                    }}
                    whileTap={{
                      scale: 0.98,
                    }}
                    transition={springSnappy}
                    className="aspect-square w-full overflow-hidden rounded-[14px] border-2 border-white shadow-[0px_6px_18px_0px_rgba(23,50,77,0.1)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-alma-accent-ring"
                  >
                    <img src={w.url} alt="" loading="lazy" className="h-full w-full object-cover" />
                  </motion.button>
                  <div className="absolute start-2 top-2 opacity-0 transition-opacity focus-within:opacity-100 group-hover/tile:opacity-100">
                    <Ke1Component active={favourites.has(w.id)} onToggle={() => onToggleFavourite(w)} size="sm" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
      {i.length > 0 && (
        <div className="sticky top-2 hidden h-fit shrink-0 flex-col items-center gap-0.5 rounded-full border border-[rgba(23,50,77,0.08)] bg-white/80 px-2 py-3 lg:flex">
          {i.map((h) => {
            const y = n === h.key;
            return (
              <button
                key={h.key}
                type="button"
                onClick={() => F(h.key)}
                className={cn(
                  "relative rounded-full px-2.5 py-1 font-body text-[11px] font-medium tracking-[0.5px] transition-colors",
                  y ? "text-[#17324d]" : "text-[rgba(23,50,77,0.45)] hover:text-alma-ink",
                )}
              >
                {y && (
                  <motion.span
                    layoutId="timeline-rail-pill"
                    transition={springSnappy}
                    className="absolute inset-0 rounded-full bg-alma-panel"
                  />
                )}
                <span className="relative">{h.label}</span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
const iconX =
  "data:image/svg+xml,%3csvg%20preserveAspectRatio='none'%20overflow='visible'%20style='display:%20block;'%20width='16'%20height='16'%20viewBox='0%200%2016%2016'%20fill='none'%20xmlns='http://www.w3.org/2000/svg'%3e%3cg%20id='icon/x'%3e%3cpath%20id='Vector'%20d='M12%204L4%2012M4%204L12%2012'%20stroke='%2317324d'%20stroke-opacity='0.6'%20stroke-width='1.2'%20stroke-linecap='round'%20stroke-linejoin='round'/%3e%3c/g%3e%3c/svg%3e";
const iconUp4 =
  "data:image/svg+xml,%3csvg%20preserveAspectRatio='none'%20overflow='visible'%20style='display:%20block;'%20width='24'%20height='24'%20viewBox='0%200%2024%2024'%20fill='none'%20xmlns='http://www.w3.org/2000/svg'%3e%3cg%20id='icon/up'%3e%3cpath%20id='Vector'%20d='M21%2015V19C21%2019.5304%2020.7893%2020.0391%2020.4142%2020.4142C20.0391%2020.7893%2019.5304%2021%2019%2021H5C4.46957%2021%203.96086%2020.7893%203.58579%2020.4142C3.21071%2020.0391%203%2019.5304%203%2019V15'%20stroke='%2317324d'%20stroke-opacity='0.95'%20stroke-width='1.2'%20stroke-linecap='round'%20stroke-linejoin='round'/%3e%3cpath%20id='Vector_2'%20d='M17%208L12%203L7%208'%20stroke='%2317324d'%20stroke-opacity='0.95'%20stroke-width='1.2'%20stroke-linecap='round'%20stroke-linejoin='round'/%3e%3cpath%20id='Vector_3'%20d='M12%203V16'%20stroke='%2317324d'%20stroke-opacity='0.95'%20stroke-width='1.2'%20stroke-linecap='round'%20stroke-linejoin='round'/%3e%3c/g%3e%3c/svg%3e";
const iconUp5 =
  "data:image/svg+xml,%3csvg%20preserveAspectRatio='none'%20overflow='visible'%20style='display:%20block;'%20width='16'%20height='16'%20viewBox='0%200%2016%2016'%20fill='none'%20xmlns='http://www.w3.org/2000/svg'%3e%3cg%20id='icon/up'%3e%3cpath%20id='Vector'%20d='M14%2010V12.6667C14%2013.0203%2013.8595%2013.3594%2013.6095%2013.6095C13.3594%2013.8595%2013.0203%2014%2012.6667%2014H3.33333C2.97971%2014%202.64057%2013.8595%202.39052%2013.6095C2.14048%2013.3594%202%2013.0203%202%2012.6667V10'%20stroke='%2317324d'%20stroke-opacity='0.9'%20stroke-width='1.2'%20stroke-linecap='round'%20stroke-linejoin='round'/%3e%3cpath%20id='Vector_2'%20d='M11.3333%205.33333L8%202L4.66667%205.33333'%20stroke='%2317324d'%20stroke-opacity='0.9'%20stroke-width='1.2'%20stroke-linecap='round'%20stroke-linejoin='round'/%3e%3cpath%20id='Vector_3'%20d='M8%202V10.6667'%20stroke='%2317324d'%20stroke-opacity='0.9'%20stroke-width='1.2'%20stroke-linecap='round'%20stroke-linejoin='round'/%3e%3c/g%3e%3c/svg%3e";
const iconCheck =
  "data:image/svg+xml,%3csvg%20preserveAspectRatio='none'%20overflow='visible'%20style='display:%20block;'%20width='15'%20height='15'%20viewBox='0%200%2015%2015'%20fill='none'%20xmlns='http://www.w3.org/2000/svg'%3e%3cg%20id='icon/check'%3e%3cpath%20id='Vector'%20d='M12.5%203.75L5.625%2010.625L2.5%207.5'%20stroke='%2317324d'%20stroke-width='1.2'%20stroke-linecap='round'%20stroke-linejoin='round'/%3e%3c/g%3e%3c/svg%3e";
const iconSpark2 =
  "data:image/svg+xml,%3csvg%20preserveAspectRatio='none'%20overflow='visible'%20style='display:%20block;'%20width='15'%20height='15'%20viewBox='0%200%2015%2015'%20fill='none'%20xmlns='http://www.w3.org/2000/svg'%3e%3cg%20id='icon/spark'%3e%3cpath%20id='Vector'%20d='M7.5%201.875V4.375M7.5%2010.625V13.125M1.875%207.5H4.375M10.625%207.5H13.125M3.75%203.75L5.3125%205.3125M9.6875%209.6875L11.25%2011.25M11.25%203.75L9.6875%205.3125M5.3125%209.6875L3.75%2011.25'%20stroke='%23285e85'%20stroke-opacity='0.9'%20stroke-width='1.2'%20stroke-linecap='round'%20stroke-linejoin='round'/%3e%3c/g%3e%3c/svg%3e";
const iconDown =
  "data:image/svg+xml,%3csvg%20preserveAspectRatio='none'%20overflow='visible'%20style='display:%20block;'%20width='14'%20height='14'%20viewBox='0%200%2014%2014'%20fill='none'%20xmlns='http://www.w3.org/2000/svg'%3e%3cg%20id='icon/down'%3e%3cpath%20id='Vector'%20d='M3.5%205.25L7%208.75L10.5%205.25'%20stroke='%2317324d'%20stroke-opacity='0.5'%20stroke-width='1.2'%20stroke-linecap='round'%20stroke-linejoin='round'/%3e%3c/g%3e%3c/svg%3e";
const length_1 = 3;
function Ze(t) {
  if (t < 1024) {
    return `${t} B`;
  }
  if (t < 1024 * 1024) {
    return `${(t / 1024).toFixed(0)} KB`;
  }
  return `${(t / (1024 * 1024)).toFixed(1)} MB`;
}
function HsComponent({ open, onOpenChange, uploadOne, validate, vaults, onFinished }) {
  const { t: t_1 } = useI18n();
  const [n, setN] = React.useState([]);
  const [m, setM] = React.useState(false);
  const [_, set_] = React.useState(true);
  const [value, setValue] = React.useState("");
  const [w, setW] = React.useState(false);
  const CRef = React.useRef(null);
  const O = React.useCallback((u) => {
    for (const A of u) {
      if (A.previewUrl) {
        URL.revokeObjectURL(A.previewUrl);
      }
    }
  }, []);
  React.useEffect(() => {
    if (!open) {
      setN((u) => {
        O(u);
        return [];
      });
      setW(false);
    }
  }, [open, O]);
  React.useEffect(() => () => O(n), [n, O]);
  const G = React.useCallback(
    (u) => {
      const A = [];
      const H = [];
      for (const file of u) {
        const p = validate(file);
        if (p) {
          H.push(`${file.name}: ${p}`);
          continue;
        }
        A.push({
          key: `${file.name}-${file.size}-${file.lastModified}`,
          file,
          previewUrl: file.type.startsWith("image/") ? URL.createObjectURL(file) : null,
          status: "queued",
          note: null,
        });
      }
      for (const L of H) {
        toast.error(L);
      }
      if (A.length !== 0) {
        setN((L) => {
          const p = new Set(L.map((x) => x.key));
          return [...L, ...A.filter((x) => !p.has(x.key))];
        });
      }
    },
    [validate],
  );
  const f = (key, status, note = null) =>
    setN((L) =>
      L.map((p) => {
        if (p.key === key) {
          return {
            ...p,
            status,
            note,
          };
        }
        return p;
      }),
    );
  const j = async () => {
    const u = n.filter((x) => x.status === "queued" || x.status === "failed");
    if (u.length === 0) {
      return;
    }
    setW(true);
    let A = 0;
    let H = 0;
    const L = [...u];
    const p = async () => {
      while (true) {
        const x = L.shift();
        if (!x) {
          return;
        }
        f(x.key, "uploading");
        try {
          await uploadOne(x.file);
          f(x.key, "done", _ ? "Kept · ALMA is filing it" : "Kept");
          A += 1;
        } catch (error) {
          console.error("Upload failed:", error);
          f(x.key, "failed", "Failed — press Upload to retry");
          H += 1;
        }
      }
    };
    try {
      await Promise.all(
        Array.from(
          {
            length: length_1,
          },
          p,
        ),
      );
    } finally {
      setW(false);
    }
    if (A > 0) {
      onFinished();
    }
    if (A > 0 && H === 0) {
      toast.success(`Uploaded ${A} ${A === 1 ? "file" : "files"}`);
      onOpenChange(false);
    } else if (A > 0) {
      toast.warning(`Uploaded ${A} of ${A + H} — ${H} failed`);
    } else if (H > 0) {
      toast.error("Nothing uploaded — check the files and try again");
    }
  };
  const k = n.reduce((acc, item) => acc + item.file.size, 0);
  const length = n.filter((u) => u.status !== "done").length;
  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[60] flex items-end justify-center overflow-y-auto sm:items-start sm:px-4 sm:py-[8vh]">
          <motion.button
            type="button"
            aria-label={t_1("action.close")}
            onClick={() => !w && onOpenChange(false)}
            initial={{
              opacity: 0,
            }}
            animate={{
              opacity: 1,
            }}
            exit={{
              opacity: 0,
            }}
            transition={fadeQuick}
            className="fixed inset-0 cursor-default bg-gradient-to-b from-[rgba(234,243,250,0.62)] to-[rgba(234,243,250,0.78)] backdrop-blur-[5.5px]"
          />
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label={t_1("vault.addToYours")}
            initial={{
              opacity: 0,
              y: 24,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            exit={{
              opacity: 0,
              y: 16,
            }}
            transition={springPop}
            className="relative flex max-h-[88dvh] w-full flex-col gap-[18px] overflow-y-auto rounded-t-[24px] border border-[rgba(23,50,77,0.11)] bg-white/[0.99] px-5 pb-[22px] pt-3 shadow-[0px_24px_64px_0px_rgba(23,50,77,0.2)] sm:max-h-none sm:w-[min(660px,100%)] sm:rounded-[24px] sm:px-6 sm:pt-[26px]"
          >
            <div aria-hidden className="mx-auto h-1 w-10 shrink-0 rounded-full bg-alma-line sm:hidden" />
            <div className="flex items-center gap-3">
              <div className="flex min-w-0 flex-1 flex-col gap-[5px]">
                <h2 className="font-display text-xl font-semibold tracking-[0.2px] text-alma-ink">
                  {t_1("vault.addToYours")}
                </h2>
                <p className="font-body text-[12.5px] tracking-[0.125px] text-[rgba(23,50,77,0.55)]">
                  They land in Gallery straight away, and ALMA files them for you.
                </p>
              </div>
              <button
                type="button"
                onClick={() => !w && onOpenChange(false)}
                aria-label={t_1("action.close")}
                className="flex size-[34px] shrink-0 items-center justify-center rounded-full border border-[rgba(23,50,77,0.11)] bg-[#eaf3fa] transition-colors hover:bg-white"
              >
                <img src={iconX} alt="" className="h-4 w-4" />
              </button>
            </div>
            <div
              onDragOver={(u) => {
                u.preventDefault();
                setM(true);
              }}
              onDragLeave={() => setM(false)}
              onDrop={(u) => {
                u.preventDefault();
                setM(false);
                G(Array.from(u.dataTransfer.files));
              }}
              className={cn(
                "flex h-[196px] flex-col items-center justify-center gap-[11px] rounded-[18px] border-2 border-dashed transition-colors",
                m ? "border-alma-accent-deep bg-[#eaf3fa]" : "border-[rgba(40,94,133,0.32)] bg-[#eaf3fa]",
              )}
            >
              <motion.span
                animate={
                  m
                    ? {
                        scale: 1.08,
                      }
                    : {
                        scale: 1,
                      }
                }
                transition={springPop}
                className="flex size-[54px] items-center justify-center rounded-[17px] drop-shadow-[0px_6px_8px_rgba(40,94,133,0.18)]"
                style={{
                  backgroundImage: "linear-gradient(90deg, #285e85, #2f6e99)",
                }}
              >
                <img src={iconUp4} alt="" className="h-6 w-6" />
              </motion.span>
              <p className="font-display text-[17px] font-semibold tracking-[0.17px] text-alma-ink">
                {t_1("upload.drop")}
              </p>
              <div className="flex items-center gap-1.5">
                <span className="font-body text-[12.5px] text-[rgba(23,50,77,0.55)]">or</span>
                <button
                  type="button"
                  onClick={() => CRef.current?.click()}
                  className="rounded-full border border-[rgba(23,50,77,0.14)] bg-white px-3 py-1.5 font-body text-[12.5px] font-medium text-[rgba(23,50,77,0.85)] transition-colors hover:bg-alma-panel/40"
                >
                  browse your files
                </button>
              </div>
              <p className="font-body text-[11px] tracking-[0.22px] text-[rgba(23,50,77,0.42)]">
                JPG · PNG · HEIC · MP4  ·  up to 200 MB each
              </p>
              <input
                ref={CRef}
                type="file"
                accept="image/*"
                multiple
                className="hidden"
                onChange={(u) => {
                  const A = Array.from(u.target.files ?? []);
                  u.target.value = "";
                  G(A);
                }}
              />
            </div>
            {n.length > 0 && (
              <>
                <div className="flex items-center gap-2.5">
                  <p className="font-body text-[10px] font-medium tracking-[1.2px] text-[rgba(23,50,77,0.42)]">
                    IN THIS BATCH · {n.length} {n.length === 1 ? "FILE" : "FILES"} · {Ze(k)}
                  </p>
                  <span className="flex-1" />
                  <button
                    type="button"
                    disabled={w}
                    onClick={() =>
                      setN((u) => {
                        O(u);
                        return [];
                      })
                    }
                    className="font-body text-[11.5px] font-medium tracking-[0.23px] text-[rgba(23,50,77,0.5)] hover:text-alma-ink disabled:opacity-40"
                  >
                    {t_1("upload.clearAll")}
                  </button>
                </div>
                <div className="flex max-h-[240px] flex-col gap-2 overflow-y-auto">
                  <AnimatePresence initial={false}>
                    {n.map((u) => (
                      <motion.div
                        key={u.key}
                        layout
                        initial={{
                          opacity: 0,
                          y: 8,
                        }}
                        animate={{
                          opacity: 1,
                          y: 0,
                        }}
                        exit={{
                          opacity: 0,
                          scale: 0.96,
                        }}
                        transition={springSnappy}
                        className={cn(
                          "flex items-center gap-[13px] rounded-[14px] border py-2.5 ps-2.5 pe-3.5",
                          u.status === "done"
                            ? "border-[rgba(40,94,133,0.18)] bg-[#eaf3fa]"
                            : u.status === "failed"
                              ? "border-[rgba(179,38,30,0.25)] bg-[#fdf1f0]"
                              : "border-[rgba(23,50,77,0.09)] bg-[#f6f9fc]",
                        )}
                      >
                        {u.previewUrl ? (
                          <img src={u.previewUrl} alt="" className="size-[42px] shrink-0 rounded-[11px] object-cover" />
                        ) : (
                          <span className="size-[42px] shrink-0 rounded-[11px] bg-[#eaf3fa]" />
                        )}
                        <div className="flex min-w-0 flex-1 flex-col gap-1.5">
                          <div className="flex items-center gap-2.5">
                            <p className="truncate font-body text-[13px] font-medium tracking-[0.13px] text-[rgba(23,50,77,0.95)]">
                              {u.file.name}
                            </p>
                            <p className="shrink-0 font-body text-[11px] tracking-[0.22px] text-[rgba(23,50,77,0.42)]">
                              {Ze(u.file.size)}
                            </p>
                          </div>
                          {u.status === "uploading" ? (
                            <div className="h-[5px] w-full overflow-hidden rounded-[3px] bg-[rgba(23,50,77,0.1)]">
                              <motion.div
                                className="h-full w-1/3 rounded-[3px] bg-gradient-to-r from-alma-accent-from to-alma-accent-deep"
                                animate={{
                                  x: ["-100%", "300%"],
                                }}
                                transition={{
                                  duration: 1.1,
                                  repeat: Infinity,
                                  ease: "easeInOut",
                                }}
                              />
                            </div>
                          ) : (
                            <p
                              className={cn(
                                "truncate font-body text-[11px] tracking-[0.22px]",
                                u.status === "failed" ? "text-[#b3261e]" : "text-[rgba(23,50,77,0.5)]",
                              )}
                            >
                              {u.note ?? "Waiting to upload"}
                            </p>
                          )}
                        </div>
                        {u.status === "done" ? (
                          <motion.span
                            initial={{
                              scale: 0.5,
                            }}
                            animate={{
                              scale: 1,
                            }}
                            transition={springPop}
                            className="flex size-[26px] shrink-0 items-center justify-center rounded-full"
                            style={{
                              backgroundImage: "linear-gradient(90deg, #285e85, #2f6e99)",
                            }}
                          >
                            <img src={iconCheck} alt="Uploaded" className="h-[15px] w-[15px]" />
                          </motion.span>
                        ) : (
                          <span className="flex size-[26px] shrink-0 items-center justify-center rounded-full border border-[rgba(23,50,77,0.1)] bg-white">
                            <img src={iconClock2} alt="" className="h-[15px] w-[15px]" />
                          </span>
                        )}
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              </>
            )}
            <div className="flex items-center gap-3 rounded-[14px] border border-[rgba(40,94,133,0.16)] bg-[#eaf3fa] px-3.5 py-[13px]">
              <img src={iconSpark2} alt="" className="h-[15px] w-[15px] shrink-0" />
              <div className="flex min-w-0 flex-1 flex-col gap-[3px]">
                <p className="font-body text-[12.5px] font-medium tracking-[0.25px] text-[rgba(23,50,77,0.95)]">
                  {t_1("upload.autoTag")}
                </p>
                <p className="font-body text-[11px] tracking-[0.22px] text-[rgba(23,50,77,0.6)]">
                  {t_1("upload.autoTagNote")}
                </p>
              </div>
              <Switch
                checked={_}
                onCheckedChange={set_}
                aria-label={t_1("upload.autoTag")}
                className="shrink-0 data-[state=checked]:bg-alma-accent-deep"
              />
            </div>
            <div className="flex flex-wrap items-center gap-2.5">
              <label className="flex items-center gap-2 rounded-[12px] border border-[rgba(23,50,77,0.12)] bg-alma-field py-[11px] ps-3.5 pe-3">
                <span className="font-body text-[13px] text-[rgba(23,50,77,0.6)]">{t_1("vault.addTo")}</span>
                <select
                  value={value}
                  onChange={(u) => setValue(u.target.value)}
                  className="cursor-pointer bg-transparent font-body text-[13px] font-medium text-alma-ink outline-none"
                >
                  <option value="">{t_1("upload.none")}</option>
                  {vaults.map((u) => (
                    <option key={u.id} value={u.id}>
                      {u.name}
                    </option>
                  ))}
                </select>
                <img src={iconDown} alt="" className="h-3.5 w-3.5" />
              </label>
              <span className="flex-1" />
              <button
                type="button"
                onClick={() => onOpenChange(false)}
                disabled={w}
                className="rounded-full border border-[rgba(23,50,77,0.14)] bg-white px-[18px] py-3 font-body text-[13px] font-medium tracking-[0.26px] text-[rgba(23,50,77,0.8)] transition-colors hover:bg-alma-panel/40 disabled:opacity-50"
              >
                {t_1("action.cancel")}
              </button>
              <button
                type="button"
                onClick={() => void j()}
                disabled={w || length === 0}
                className="flex items-center gap-2 rounded-full bg-gradient-to-r from-alma-accent-from to-alma-accent-to px-5 py-3 font-body text-[13px] font-medium tracking-[0.26px] text-white shadow-[0px_4px_12px_0px_rgba(40,94,133,0.16)] transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <img src={iconUp5} alt="" className="brightness-0 invert h-[15px] w-[15px]" />
                {w
                  ? "Uploading…"
                  : length === 0
                    ? "Nothing to upload"
                    : `Upload ${length} ${length === 1 ? "file" : "files"}`}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
function Ys(t) {
  return {
    itemKey: t.id,
    memoryId: t.memoryId ?? null,
    galleryImageId: t.source === "gallery" ? t.id : null,
  };
}
function Qe(t) {
  if (t && typeof t === "object" && !Array.isArray(t)) {
    return t;
  }
  return {};
}
function Zs(prefs) {
  const favourites = Qe(prefs).favourites;
  if (Array.isArray(favourites)) {
    return [...new Set(favourites.filter((o) => typeof o === "string" && o.length > 0))];
  }
  return [];
}
function et(prefs, s) {
  const o = {
    ...Qe(prefs),
  };
  const r = [...new Set(s)];
  if (r.length === 0) {
    delete o.favourites;
  } else {
    o.favourites = r;
  }
  return o;
}
function qs(t, keys) {
  return new Set([...t, ...keys]);
}
function Ks(t, keys) {
  const o = new Set(t);
  return keys.filter((r) => !o.has(r));
}
function Gs(t, s, o) {
  const r = new Set(t);
  if (o) {
    r.add(s);
  } else {
    r.delete(s);
  }
  return r;
}
function tt(error) {
  if (!error) {
    return false;
  }
  if (error.code === "42P01" || error.code === "PGRST205") {
    return true;
  }
  const s = (error.message ?? "").toLowerCase();
  return s.includes("does not exist") || s.includes("schema cache");
}
const ve = "photo_favourites";
let de = null;
async function Ae(t) {
  const { data } = await supabase.from("profiles").select("preferences").eq("user_id", t).maybeSingle();
  const prefs = data?.preferences ?? null;
  return {
    prefs,
    keys: Zs(prefs),
  };
}
async function Ws(t, s) {
  const { prefs } = await Ae(t);
  await supabase
    .from("profiles")
    .update({
      preferences: et(prefs, s),
    })
    .eq("user_id", t);
}
async function Js(t) {
  const { keys } = await Ae(t);
  if (de === false) {
    return new Set(keys);
  }
  const { data, error } = await supabase.from(ve).select("item_key").eq("user_id", t);
  if (error) {
    if (tt(error)) {
      return (de = false), new Set(keys);
    }
    return console.error("Favourites load failed:", error), new Set(keys);
  }
  de = true;
  const l = (data ?? []).map((i) => i.item_key);
  const a = Ks(l, keys);
  if (a.length > 0) {
    const { error: error_1 } = await supabase.from(ve).upsert(
      a.map((item_key) => ({
        user_id: t,
        item_key,
      })),
      {
        onConflict: "user_id,item_key",
      },
    );
    if (!error_1) {
      await Ws(t, []);
    }
  }
  return qs(l, keys);
}
async function Xs(t, s, o) {
  if (de !== false) {
    const n = o
      ? await supabase.from(ve).upsert(
          {
            user_id: t,
            item_key: s.itemKey,
            memory_id: s.memoryId,
            gallery_image_id: s.galleryImageId,
          },
          {
            onConflict: "user_id,item_key",
          },
        )
      : await supabase.from(ve).delete().eq("user_id", t).eq("item_key", s.itemKey);
    if (!n.error) {
      de = true;
      return;
    }
    if (!tt(n.error)) {
      throw n.error;
    }
    de = false;
  }
  const { prefs, keys } = await Ae(t);
  const a = o ? [...new Set([...keys, s.itemKey])] : keys.filter((n) => n !== s.itemKey);
  const { error } = await supabase
    .from("profiles")
    .update({
      preferences: et(prefs, a),
    })
    .eq("user_id", t);
  if (error) {
    throw error;
  }
}
const Qs = (t) => {
  if (!t) {
    return null;
  }
  const s = "/gallery-images/";
  const o = t.indexOf(s);
  if (o === -1) {
    return null;
  }
  return decodeURIComponent(t.slice(o + s.length));
};
const eo = 180;
const Gallery = () => {
  const { t } = useI18n();
  const [s, setS] = React.useState([]);
  const [uploading, setUploading] = React.useState(false);
  const [a, setA] = React.useState(null);
  const [n, setN] = React.useState(true);
  const [m, setM] = React.useState("orbit");
  const [_, set_] = React.useState("all");
  const [h, setH] = React.useState([]);
  const [w, setW] = React.useState({});
  const [C, setC] = React.useState(null);
  const GRef = React.useRef(null);
  const [f, setF] = React.useState(null);
  const [k, setK] = React.useState(new Set());
  const [u, setU] = React.useState(false);
  const [vaults, setVaults] = React.useState([]);
  const [p, setP] = React.useState(false);
  const [T, setT] = React.useState([]);
  const [ne, setNe] = React.useState(false);
  const fe = useNavigate();
  const leRef = React.useRef(null);
  const I = (c) =>
    setT((b) => {
      if (b.includes(c)) {
        return b.filter((v) => v !== c);
      }
      return [...b, c];
    });
  const E = React.useCallback(
    async (c) => {
      try {
        const { data, error } = await supabase.from("gallery_images").select("*").eq("user_id", c).order("created_at", {
          ascending: true,
        });
        if (error) {
          throw error;
        }
        const S = (data || []).map((R) => ({
          id: R.id,
          url: R.file_url,
          title: R.file_name || "Memory",
          storagePath: R.storage_path ?? undefined,
          createdAt: R.created_at ?? undefined,
          x: R.x,
          y: R.y,
          width: R.width,
          height: R.height,
        }));
        setS(S);
      } catch (error) {
        console.error("Error loading gallery images:", error);
        toast.error(t("gallery.err.load"));
      } finally {
        setN(false);
      }
    },
    [t],
  );
  React.useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setA(data.user);
      if (data.user) {
        E(data.user.id);
      } else {
        setN(false);
      }
    });
  }, [E]);
  const te = async (c) => {
    const b = URL.createObjectURL(c);
    let v = qe;
    try {
      const me = await Ot(b, {
        create: () => new Image(),
      });
      if (me) {
        v = Et(me.width, me.height);
      }
    } finally {
      URL.revokeObjectURL(b);
    }
    const x = Math.random() * 1000;
    const y = Math.random() * 1000;
    const B = $t(a.id, c.name, Date.now());
    const { error } = await supabase.storage.from("gallery-images").upload(B, c);
    if (error) {
      throw error;
    }
    const {
      data: { publicUrl },
    } = supabase.storage.from("gallery-images").getPublicUrl(B);
    const { data, error: error_1 } = await supabase
      .from("gallery_images")
      .insert({
        user_id: a.id,
        file_url: publicUrl,
        file_name: c.name,
        storage_path: B,
        x,
        y,
        width: v.width,
        height: v.height,
      })
      .select()
      .single();
    if (error_1) {
      throw error_1;
    }
    return {
      id: data.id,
      url: publicUrl,
      title: c.name,
      storagePath: B,
      createdAt: new Date().toISOString(),
      x,
      y,
      width: v.width,
      height: v.height,
    };
  };
  const je = async (c) => {
    const b = s.find((v) => v.id === c);
    try {
      const { data } = await supabase
        .from("memories")
        .select("id")
        .eq("user_id", a?.id ?? "")
        .eq("metadata->>gallery_image_id", c);
      const S = (data ?? []).map((V) => V.id);
      if (S.length > 0) {
        await supabase.from("memory_media").delete().in("memory_id", S);
        const { error: error_1 } = await supabase.from("memories").delete().in("id", S);
        if (error_1) {
          console.error("Vault entry delete failed:", error_1);
        }
      }
      const R = b?.storagePath ?? Qs(b?.url);
      if (R) {
        const { error: error_1 } = await supabase.storage.from("gallery-images").remove([R]);
        if (error_1) {
          console.error("Storage delete failed (row still removed):", error_1);
        }
      }
      const { error } = await supabase.from("gallery_images").delete().eq("id", c);
      if (error) {
        throw error;
      }
      setS((V) => V.filter((X) => X.id !== c));
      toast.success(S.length > 0 ? "Image removed, along with its vault entry" : "Image removed");
    } catch (error) {
      console.error("Delete error:", error);
      toast.error(t("gallery.err.delete"));
    }
  };
  const be = React.useCallback(async (c) => {
    var R;
    const { data, error } = await supabase
      .from("memories")
      .select("id, content, tags, timestamp, created_at, metadata")
      .eq("user_id", c)
      .order("timestamp", {
        ascending: false,
      })
      .limit(500);
    if (error) {
      console.error("Error loading photo memories:", error);
      return;
    }
    const S = [];
    for (const B of data ?? []) {
      const V = B.metadata;
      const X = Array.isArray(V?.attachments) ? V.attachments : [];
      for (const Q of X) {
        if (!(Q != null && Q.url) || !((R = Q.type) != null && R.startsWith("image/"))) {
          continue;
        }
        const { title, body } = splitTitle(B.content);
        S.push({
          id: `memory-${B.id}-${Q.url}`,
          url: Q.url,
          title,
          takenAt: B.timestamp ?? B.created_at ?? new Date().toISOString(),
          tags: B.tags ?? [],
          caption: body || B.content || null,
          source: "memory",
          memoryId: B.id,
          ...(V != null && V.gallery_image_id
            ? {
                galleryImageId: V.gallery_image_id,
              }
            : {}),
        });
      }
    }
    setH(S);
  }, []);
  const Se = React.useCallback(async (c) => {
    var B;
    const [{ data }, { data: data_1 }] = await Promise.all([
      supabase.from("context_entities").select("id, name, kind").eq("user_id", c),
      supabase.from("context_mentions").select("memory_id, entity_id").eq("user_id", c),
    ]);
    const S = new Map((data ?? []).map((V) => [V.id, V]));
    const R = {};
    for (const V of data_1 ?? []) {
      const X = S.get(V.entity_id);
      if (!X || !V.memory_id) {
        continue;
      }
      const Q =
        R[(B = V.memory_id)] ??
        (R[B] = {
          places: [],
          people: [],
          revisits: 0,
        });
      const ae = X.kind === "person" ? Q.people : X.kind === "place" ? Q.places : null;
      if (ae && !ae.includes(X.name)) {
        ae.push(X.name);
      }
    }
    setW(R);
  }, []);
  React.useEffect(() => {
    if (a != null && a.id) {
      supabase
        .from("vaults")
        .select("id, name")
        .eq("user_id", a.id)
        .order("name")
        .then(({ data }) => setVaults(data ?? []));
      be(a.id);
      Se(a.id);
      Js(a.id)
        .then(setK)
        .catch((c) => {
          console.error("Favourites load failed:", c);
        });
    }
  }, [a?.id, be, Se]);
  const ye = React.useCallback(
    async (c) => {
      if (!(a != null && a.id)) {
        return;
      }
      const b = !k.has(c.id);
      const v = k;
      setK((S) => Gs(S, c.id, b));
      try {
        await Xs(a.id, Ys(c), b);
      } catch (error) {
        console.error("Favourite write failed:", error);
        setK(v);
        toast.error(t("gallery.err.favourite"));
      }
    },
    [a?.id, k, t],
  );
  const pe = React.useMemo(() => {
    const c = new Set(h.map((v) => v.galleryImageId).filter(Boolean));
    const b = s
      .filter((v) => !c.has(v.id))
      .map((v) => ({
        id: v.id,
        url: v.url,
        title: v.title?.replace(/\.[a-z0-9]+$/i, "") || "Photo",
        takenAt: v.createdAt ?? new Date().toISOString(),
        tags: [],
        caption: null,
        source: "gallery",
      }));
    return [...h, ...b].sort((v, S) => new Date(S.takenAt).getTime() - new Date(v.takenAt).getTime());
  }, [s, h]);
  const ue = React.useCallback(
    (c) => {
      if (c.memoryId) {
        return w[c.memoryId] ?? Be;
      }
      return Be;
    },
    [w],
  );
  const items = React.useMemo(() => {
    switch (_) {
      case "people":
        return pe.filter((c) => ue(c).people.length > 0);
      case "places":
        return pe.filter((c) => ue(c).places.length > 0);
      case "favourites":
        return pe.filter((c) => k.has(c.id));
      default:
        return pe;
    }
  }, [pe, _, ue, k]);
  const now = React.useMemo(() => new Date(), []);
  const we = items.findIndex((c) => c.id === f);
  const J = we >= 0 ? items[we] : null;
  const related = React.useMemo(() => {
    if (!J) {
      return [];
    }
    const c = J.tags[0];
    const b = items.filter((S) => S.id !== J.id);
    if (!c) {
      return b.slice(0, 4);
    }
    const v = b.filter((S) => S.tags.includes(c));
    return (v.length > 0 ? v : b).slice(0, 4);
  }, [J, items]);
  const Ve = (c) => {
    if (items.length === 0) {
      return;
    }
    const b = (we + c + items.length) % items.length;
    setF(items[b].id);
  };
  const Le = async (c) => {
    try {
      await navigator.clipboard.writeText(c.url);
      toast.success(t("gallery.ok.linkCopied"));
    } catch {
      toast.error(t("gallery.err.linkCopy"));
    }
  };
  const onPointerEnter = React.useCallback(() => {
    if (GRef.current !== null) {
      window.clearTimeout(GRef.current);
      GRef.current = null;
    }
  }, []);
  const onPointerLeave = React.useCallback(() => {
    onPointerEnter();
    GRef.current = window.setTimeout(() => {
      GRef.current = null;
      setC(null);
    }, eo);
  }, [onPointerEnter]);
  React.useEffect(() => onPointerEnter, [onPointerEnter]);
  const style = React.useMemo(() => {
    if (!C || !leRef.current) {
      return null;
    }
    const c = leRef.current.getBoundingClientRect();
    const b = 280;
    const S = C.rect.left - c.left > c.width / 2 ? C.rect.left - c.left - b - 12 : C.rect.right - c.left + 12;
    return {
      position: "absolute",
      left: Math.max(12, Math.min(S, c.width - b - 12)),
      top: Math.max(12, Math.min(C.rect.top - c.top, c.height - 320)),
    };
  }, [C]);
  return (
    <div className="app-shell-offset flex h-screen w-full bg-alma-canvas">
      <AppSidebar />
      <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
        <XtComponent view={m} onViewChange={setM} onUpload={() => setU(true)} uploading={uploading} />
        {n ? (
          <p className="flex-1 pt-20 text-center font-body text-sm text-[rgba(23,50,77,0.5)]">Loading your gallery…</p>
        ) : (
          <AnimatePresence mode="wait">
            {m === "orbit" && (
              <motion.div
                key="orbit"
                initial={{
                  opacity: 0,
                }}
                animate={{
                  opacity: 1,
                }}
                exit={{
                  opacity: 0,
                }}
                transition={fadeQuick}
                className="flex min-h-0 flex-1 flex-col overflow-hidden px-4 pb-4 sm:px-6 lg:px-[30px]"
              >
                <div
                  ref={leRef}
                  className="relative flex min-h-0 flex-1 flex-col gap-3 overflow-hidden rounded-[24px] border border-[rgba(23,50,77,0.08)] bg-gradient-to-b from-[#eaf3fa] to-[#eaf3fa] p-3 sm:p-4"
                >
                  <Ms1Component
                    items={items}
                    now={now}
                    totalCount={items.length}
                    hoveredId={C?.item.id ?? null}
                    onHover={(c, rect) => {
                      if (c && rect) {
                        onPointerEnter();
                        setC({
                          item: c,
                          rect,
                        });
                      } else {
                        onPointerLeave();
                      }
                    }}
                    onOpen={(c) => {
                      onPointerEnter();
                      setC(null);
                      setF(c.id);
                    }}
                    overlay={
                      items.length === 0 ? (
                        <Ys1Component onUpload={() => setU(true)} onLinkWhatsApp={() => fe("/settings")} />
                      ) : null
                    }
                  >
                    <NeComponent filter={_} onFilterChange={set_} />
                  </Ms1Component>
                  <Xs1Component items={items} now={now} />
                  <AnimatePresence>
                    {C && style && !J && (
                      <CsComponent
                        key={C.item.id}
                        item={C.item}
                        facts={ue(C.item)}
                        style={style}
                        onPointerEnter={onPointerEnter}
                        onPointerLeave={onPointerLeave}
                        onOpen={() => {
                          onPointerEnter();
                          setF(C.item.id);
                          setC(null);
                        }}
                        onShare={() => void Le(C.item)}
                        isFavourite={k.has(C.item.id)}
                        onToggleFavourite={() => void ye(C.item)}
                      />
                    )}
                  </AnimatePresence>
                  <AnimatePresence>
                    {J && (
                      <VsComponent
                        item={J}
                        facts={ue(J)}
                        index={we + 1}
                        total={items.length}
                        related={related}
                        onClose={() => setF(null)}
                        onPrev={() => Ve(-1)}
                        onNext={() => Ve(1)}
                        onOpenRelated={(c) => setF(c.id)}
                        onAddToVault={() => {
                          setT([J.id]);
                          setNe(true);
                        }}
                        onShare={() => void Le(J)}
                        isFavourite={k.has(J.id)}
                        onToggleFavourite={() => void ye(J)}
                      />
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
            )}
            {m === "timeline" && (
              <motion.div
                key="timeline"
                initial={{
                  opacity: 0,
                }}
                animate={{
                  opacity: 1,
                }}
                exit={{
                  opacity: 0,
                }}
                transition={fadeQuick}
                className="flex min-h-0 flex-1 flex-col gap-5 px-4 pb-4 sm:px-6 lg:px-[30px]"
              >
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <NeComponent filter={_} onFilterChange={set_} />
                  <span className="font-body text-[13px] text-[rgba(23,50,77,0.5)]">{Ye(items, now)}</span>
                </div>
                <IsComponent
                  items={items}
                  now={now}
                  onOpen={(c) => setF(c.id)}
                  favourites={k}
                  onToggleFavourite={(c) => void ye(c)}
                />
              </motion.div>
            )}
            {m === "grid" && (
              <motion.div
                key="grid"
                initial={{
                  opacity: 0,
                }}
                animate={{
                  opacity: 1,
                }}
                exit={{
                  opacity: 0,
                }}
                transition={fadeQuick}
                className="flex min-h-0 flex-1 flex-col gap-5 px-4 pb-8 sm:px-6 lg:px-[30px]"
              >
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <NeComponent filter={_} onFilterChange={set_} />
                  <div className="flex items-center gap-2">
                    <span className="font-body text-[13px] text-[rgba(23,50,77,0.5)]">{Ye(items, now)}</span>
                    {p ? (
                      <>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            setP(false);
                            setT([]);
                          }}
                        >
                          {t("action.cancel")}
                        </Button>
                        <Button size="sm" disabled={T.length === 0} onClick={() => setNe(true)}>
                          Add to vault ({T.length})
                        </Button>
                      </>
                    ) : (
                      <Button size="sm" variant="outline" onClick={() => setP(true)}>
                        {t("gallery.select")}
                      </Button>
                    )}
                  </div>
                </div>
                <div className="grid min-h-0 flex-1 grid-cols-2 gap-4 overflow-y-auto pb-6 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
                  {items.map((c) => {
                    const b = T.includes(c.id);
                    return (
                      <div key={c.id} className="group relative">
                        <motion.button
                          type="button"
                          whileHover={{
                            scale: 1.03,
                          }}
                          whileTap={{
                            scale: 0.98,
                          }}
                          onClick={() => {
                            if (p) {
                              return I(c.id);
                            }
                            return setF(c.id);
                          }}
                          aria-label={c.title}
                          className={cn(
                            "aspect-square w-full overflow-hidden rounded-[14px] border-2 shadow-[0px_6px_18px_0px_rgba(23,50,77,0.1)]",
                            b ? "border-alma-accent-deep" : "border-white",
                          )}
                        >
                          <img src={c.url} alt="" loading="lazy" className="h-full w-full object-cover" />
                        </motion.button>
                        {!p && (
                          <div className="absolute start-2 top-2 opacity-0 transition-opacity group-hover:opacity-100 focus-within:opacity-100">
                            <Ke1Component active={k.has(c.id)} onToggle={() => void ye(c)} size="sm" />
                          </div>
                        )}
                        {!p && c.source === "gallery" && (
                          <button
                            type="button"
                            onClick={() => je(c.id)}
                            aria-label={`Delete ${c.title}`}
                            className="absolute end-2 top-2 rounded-full bg-white/90 p-1.5 opacity-0 shadow transition-opacity group-hover:opacity-100 focus-visible:opacity-100"
                          >
                            <XIcon className="h-3.5 w-3.5 text-destructive" />
                          </button>
                        )}
                      </div>
                    );
                  })}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        )}
      </div>
      <HsComponent
        open={u}
        onOpenChange={setU}
        validate={validate}
        uploadOne={async (c) => {
          const b = await te(c);
          setS((v) => [...v, b]);
        }}
        vaults={vaults}
        onFinished={() => {
          if (a != null && a.id) {
            be(a.id);
          }
        }}
      />
      <UtComponent
        open={ne}
        onOpenChange={setNe}
        photos={s
          .filter((c) => T.includes(c.id))
          .map((c) => ({
            id: c.id,
            url: c.url,
            title: c.title,
          }))}
        onSaved={() => {
          setNe(false);
          setP(false);
          setT([]);
          if (a != null && a.id) {
            be(a.id);
          }
        }}
      />
    </div>
  );
};
export default Gallery;
