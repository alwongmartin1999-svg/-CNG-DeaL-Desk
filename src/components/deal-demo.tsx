import { useState, type ReactNode } from "react";
import {
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  BatteryFull,
  Bell,
  Banknote,
  CalendarDays,
  Check,
  ChevronRight,
  CircleHelp,
  ClipboardList,
  CreditCard,
  Droplet,
  FileText,
  Handshake,
  Hourglass,
  Info,
  Lock,
  Menu,
  Package,
  Paperclip,
  ReceiptText,
  ShieldCheck,
  Signal,
  Sprout,
  Store,
  Tractor,
  TriangleAlert,
  User,
  Users,
  Wallet,
  Wifi,
  X,
} from "lucide-react";

type Fee = "yes" | "no" | "counter" | null;
type Decision = "verified" | "rejected" | null;
type Action = "checked" | "verify" | "reject" | "return" | null;

const TONNES = 2;
const PRICE_PER_KG = 1350;
const PER_TONNE_FEE = 30000;
const VERIFICATION_FEE = 25000;
const VISIT_COST = 25000;

const SCREENS = [
  {
    label: "Buyer requirement",
    say: "Buyer requirement is captured. Maize price and CNG fee are separate. Fee response is still open in this example.",
  },
  {
    label: "Batch / supply",
    say: "Supply starts as REPORTED. It is not verified stock until evidence and checks are complete.",
  },
  {
    label: "Evidence & blockers",
    say: "The app shows why the deal cannot proceed. Capturing a record or photo does not auto-approve.",
  },
  {
    label: "Approval",
    say: "Only an authorised person changes status. The app does not invent verification or payment.",
  },
  {
    label: "Reconciliation",
    say: "We reconcile accepted quantity, external payment evidence, CNG fee and costs. Commodity value is not CNG revenue. CNG does not hold farmer or buyer commodity money.",
  },
];

const CONTROL_LINES = [
  "No live Amuru batch claimed",
  "No bank / escrow live",
  "No fee collected",
  "REPORTED ≠ VERIFIED",
  "Commodity ≠ CNG income",
];

function num(n: number) {
  return Math.abs(n).toLocaleString("en-US");
}

function signed(n: number) {
  return (n > 0 ? "+" : n < 0 ? "-" : "") + num(n);
}

function getBlocker(fee: Fee, weigh: boolean, quality: boolean, stock: boolean) {
  if (!quality)
    return { long: "Supply not verified — quality evidence missing", short: "Quality evidence missing" };
  if (!weigh) return { long: "Supply not verified — weigh ticket missing", short: "Weigh ticket missing" };
  if (!stock) return { long: "Stock authority not confirmed", short: "Stock authority not confirmed" };
  if (fee === "no")
    return { long: "Buyer declined the CNG service fee", short: "Buyer declined the CNG fee" };
  if (fee === "counter")
    return { long: "Buyer counter on the CNG fee is unresolved", short: "Fee counter unresolved" };
  if (fee !== "yes")
    return { long: "Buyer fee response is still open", short: "Buyer fee response open" };
  return null;
}

export function DealDemo() {
  const [step, setStep] = useState(0);
  const [fee, setFee] = useState<Fee>(null);
  const [weigh, setWeigh] = useState(false);
  const [quality, setQuality] = useState(false);
  const [stock, setStock] = useState(false);
  const [decision, setDecision] = useState<Decision>(null);
  const [action, setAction] = useState<Action>(null);
  const [gate, setGate] = useState<string | null>(null);

  const blocker = getBlocker(fee, weigh, quality, stock);
  const evidenceCount = [weigh, quality, stock].filter(Boolean).length;

  function go(next: number) {
    setGate(null);
    setStep(Math.max(0, Math.min(SCREENS.length - 1, next)));
  }

  function choose(next: Exclude<Action, null>) {
    setAction(next);
    setGate(null);
    if (next === "verify") {
      if (blocker) {
        setDecision(null);
        setGate(blocker.long);
      } else {
        setDecision("verified");
      }
    } else if (next === "reject") {
      setDecision("rejected");
    } else if (next === "return") {
      setDecision(null);
    }
  }

  return (
    <div className="min-h-screen bg-[#e9edf2] text-ink">
      <div className="bg-orange px-4 py-2 text-center text-xs font-extrabold tracking-wider text-white">
        ILLUSTRATIVE — NOT A LIVE TRANSACTION
      </div>
      <header className="mx-auto flex max-w-5xl items-center gap-3 px-4 pt-5">
        <span className="grid size-10 place-items-center rounded-full bg-forest text-white">
          <Sprout className="size-5" aria-hidden />
        </span>
        <div>
          <h1 className="font-display text-xl leading-none">CNG Deal Desk</h1>
          <p className="mt-1 text-sm text-muted">Illustrative demo · 5 screens</p>
        </div>
      </header>

      <main className="mx-auto grid max-w-5xl gap-8 px-4 py-6 lg:grid-cols-[22.5rem_1fr] lg:items-start">
        <div>
          <Phone>
            {step === 0 && <BuyerScreen fee={fee} onNext={() => go(1)} />}
            {step === 1 && (
              <SupplyScreen decision={decision} evidenceCount={evidenceCount} />
            )}
            {step === 2 && (
              <EvidenceScreen
                fee={fee}
                weigh={weigh}
                quality={quality}
                stock={stock}
                blocker={blocker}
                onFee={setFee}
                onWeigh={() => setWeigh(!weigh)}
                onQuality={() => setQuality(!quality)}
                onStock={() => setStock(!stock)}
              />
            )}
            {step === 3 && (
              <ApprovalScreen
                decision={decision}
                action={action}
                blocker={blocker}
                gate={gate}
                onChoose={choose}
              />
            )}
            {step === 4 && <ReconcileScreen decision={decision} fee={fee} />}
          </Phone>

          <div className="mx-auto mt-4 flex max-w-[22.5rem] items-center gap-2">
            <button
              type="button"
              disabled={step === 0}
              onClick={() => go(step - 1)}
              className="inline-flex min-h-11 flex-1 items-center justify-center gap-2 rounded-full border border-slate-300 bg-white text-sm font-semibold disabled:opacity-40"
            >
              <ArrowLeft className="size-4" aria-hidden />
              Back
            </button>
            <span className="px-1 text-sm font-semibold tabular-nums text-muted">
              {step + 1} / {SCREENS.length}
            </span>
            <button
              type="button"
              disabled={step === SCREENS.length - 1}
              onClick={() => go(step + 1)}
              className="inline-flex min-h-11 flex-1 items-center justify-center gap-2 rounded-full bg-forest text-sm font-semibold text-white disabled:opacity-40"
            >
              Next
              <ArrowRight className="size-4" aria-hidden />
            </button>
          </div>
        </div>

        <aside className="space-y-4">
          <nav aria-label="Demo screens" className="flex flex-wrap gap-2">
            {SCREENS.map((s, i) => (
              <button
                key={s.label}
                type="button"
                onClick={() => go(i)}
                aria-current={i === step ? "step" : undefined}
                className={
                  "min-h-10 rounded-full px-4 text-sm font-semibold " +
                  (i === step
                    ? "bg-forest text-white"
                    : "border border-slate-300 bg-white text-slate-700")
                }
              >
                {i + 1}. {s.label}
              </button>
            ))}
          </nav>

          <article className="rounded-2xl border border-slate-200 bg-white p-5">
            <p className="text-xs font-bold tracking-wide text-leaf">YOU SAY</p>
            <p className="mt-2 font-display text-2xl leading-snug">“{SCREENS[step].say}”</p>
          </article>

          <article className="rounded-2xl border border-slate-200 bg-white p-5">
            <p className="text-xs font-bold tracking-wide text-danger">IF CHALLENGED</p>
            <ul className="mt-2 space-y-1.5 text-sm font-semibold">
              {CONTROL_LINES.map((line) => (
                <li key={line} className="flex items-center gap-2">
                  <ShieldCheck className="size-4 shrink-0 text-leaf" aria-hidden />
                  {line}
                </li>
              ))}
            </ul>
            <p className="mt-3 text-sm text-muted">
              Someone asks “is this real?” Answer: “Illustrative. Real match needs fee decision +
              verified supply.”
            </p>
          </article>

          <article className="rounded-2xl border border-amber-200 bg-amber-50 p-5 text-sm leading-relaxed">
            <p className="font-bold">Try it live</p>
            <p className="mt-1">
              On screen 3 tick the evidence and set the fee to YES, then on screen 4 try “Move to
              VERIFIED”. With any blocker open the status stays REPORTED. If the demo ever
              misbehaves, show screenshots of these five layouts instead.
            </p>
          </article>
        </aside>
      </main>
    </div>
  );
}

/* ---------- shared pieces ---------- */

function Phone({ children }: { children: ReactNode }) {
  return (
    <div className="relative mx-auto w-full max-w-[22.5rem] rounded-[3rem] bg-neutral-900 p-2.5 shadow-[0_24px_60px_rgba(15,23,42,0.28)]">
      <div className="relative h-[43rem] overflow-hidden rounded-[2.5rem] bg-white">
        <div
          aria-hidden
          className="absolute left-1/2 top-2 z-20 h-6 w-24 -translate-x-1/2 rounded-full bg-black"
        />
        {children}
      </div>
    </div>
  );
}

function Header({
  tone,
  left,
  center,
  right,
  children,
}: {
  tone: "navy" | "green";
  left?: ReactNode;
  center: ReactNode;
  right?: ReactNode;
  children?: ReactNode;
}) {
  return (
    <header
      className={
        "relative shrink-0 overflow-hidden px-4 pb-4 pt-3 text-white " +
        (tone === "navy" ? "bg-navy" : "bg-forest")
      }
    >
      <div className="flex items-center justify-between text-xs font-semibold">
        <span>9:41</span>
        <span className="flex items-center gap-1" aria-hidden>
          <Signal className="size-3.5" />
          <Wifi className="size-3.5" />
          <BatteryFull className="size-4" />
        </span>
      </div>
      <div className="relative mt-5 flex items-center gap-3">
        {left}
        <div className="min-w-0 flex-1">{center}</div>
        {right}
      </div>
      {children}
    </header>
  );
}

function Screen({
  header,
  footer,
  children,
}: {
  header: ReactNode;
  footer?: ReactNode;
  children: ReactNode;
}) {
  return (
    <div className="flex h-full flex-col">
      {header}
      <div className="flex-1 space-y-3 overflow-y-auto bg-slate-50 px-3 py-3">
        <p className="text-center text-[10px] font-bold tracking-wider text-slate-500">
          ILLUSTRATIVE — NOT A LIVE TRANSACTION
        </p>
        {children}
      </div>
      {footer}
    </div>
  );
}

function Badge() {
  return (
    <span className="shrink-0 rounded-md bg-orange px-2.5 py-1 text-[11px] font-extrabold tracking-wide text-white">
      ILLUSTRATIVE
    </span>
  );
}

function Card({
  icon,
  title,
  children,
}: {
  icon: ReactNode;
  title: string;
  children: ReactNode;
}) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-3.5 shadow-sm">
      <div className="flex items-center gap-2.5 border-b border-slate-200 pb-2.5">
        <span className="grid size-9 shrink-0 place-items-center rounded-full bg-navy text-white">
          {icon}
        </span>
        <h2 className="text-sm font-extrabold tracking-wide text-navy">{title}</h2>
      </div>
      <div>{children}</div>
    </section>
  );
}

function Row({
  icon,
  label,
  value,
  valueClass,
}: {
  icon?: ReactNode;
  label: string;
  value: ReactNode;
  valueClass?: string;
}) {
  return (
    <div className="flex items-center gap-2.5 border-b border-slate-100 py-2.5 text-sm last:border-0">
      {icon ? <span className="shrink-0 text-blue-700">{icon}</span> : null}
      <span className="text-slate-700">{label}</span>
      <span className={"ml-auto text-right font-semibold " + (valueClass ?? "text-slate-900")}>
        {value}
      </span>
    </div>
  );
}

/* ---------- screen 1: buyer requirement ---------- */

function BuyerScreen({ fee, onNext }: { fee: Fee; onNext: () => void }) {
  const feeText = fee === null ? "OPEN" : fee.toUpperCase();
  return (
    <Screen
      header={
        <Header
          tone="navy"
          left={<ArrowLeft className="size-5 shrink-0" aria-hidden />}
          center={<h2 className="text-base font-extrabold tracking-wide">BUYER REQUIREMENT</h2>}
          right={<Badge />}
        />
      }
      footer={
        <button
          type="button"
          onClick={onNext}
          className="flex min-h-14 shrink-0 items-center justify-center gap-3 bg-green-700 text-sm font-extrabold tracking-wide text-white"
        >
          <Check className="size-5" aria-hidden />
          REQUIREMENT CAPTURED
          <ChevronRight className="size-5" aria-hidden />
        </button>
      }
    >
      <Card icon={<Store className="size-4" aria-hidden />} title="BUYER DETAILS">
        <Row icon={<User className="size-4" />} label="Buyer" value="Lira Miller Co." />
        <Row icon={<User className="size-4" />} label="Decision-maker" value="A. Buyer" />
        <Row icon={<Package className="size-4" />} label="Quantity" value="2 tonnes" />
        <Row icon={<Droplet className="size-4" />} label="Moisture" value="12–13%" />
        <Row icon={<ShieldCheck className="size-4" />} label="Quality" value="Unbroken Grade A" />
        <Row icon={<Banknote className="size-4" />} label="Price" value="1,350 UGX/kg delivery" />
        <Row icon={<CalendarDays className="size-4" />} label="Window" value="This week (example)" />
        <Row icon={<CreditCard className="size-4" />} label="Payment" value="Bank / mobile money" />
      </Card>
      <Card icon={<Banknote className="size-4" aria-hidden />} title="CNG SERVICE FEE (SEPARATE)">
        <Row label="Verification" value="UGX 25,000" />
        <Row label="Per accepted tonne" value="UGX 30,000" />
        <Row label="Minimum" value="UGX 25,000" />
        <Row
          icon={<FileText className="size-4" />}
          label="Fee response"
          value={feeText}
          valueClass={fee === "yes" ? "text-green-700" : "text-blue-700"}
        />
      </Card>
    </Screen>
  );
}

/* ---------- screen 2: batch / supply ---------- */

function SupplyScreen({
  decision,
  evidenceCount,
}: {
  decision: Decision;
  evidenceCount: number;
}) {
  const verified = decision === "verified";
  const rejected = decision === "rejected";
  return (
    <Screen
      header={
        <Header
          tone="navy"
          left={<ArrowLeft className="size-5 shrink-0" aria-hidden />}
          center={<h2 className="text-base font-extrabold tracking-wide">BATCH / SUPPLY</h2>}
          right={<Badge />}
        />
      }
      footer={
        <div
          className={
            "flex min-h-14 shrink-0 items-center justify-center gap-3 text-sm font-extrabold tracking-wide " +
            (verified
              ? "bg-green-700 text-white"
              : rejected
                ? "bg-red-600 text-white"
                : "bg-yellow text-navy")
          }
        >
          <AlertCircle className="size-5" aria-hidden />
          {verified ? "VERIFIED" : rejected ? "REJECTED" : "REPORTED — NOT VERIFIED"}
        </div>
      }
    >
      <Card icon={<ClipboardList className="size-4" aria-hidden />} title="BATCH INFORMATION">
        <Row label="Batch ID" value="BATCH-EX-001" />
        <Row label="Group" value="Amuru Farmer Group" />
        <Row label="Location" value="Amuru (example)" />
        <Row label="Representative" value="[example name]" />
        <Row
          label="Quantity"
          value={
            <span className="inline-flex items-center gap-2">
              2 tonnes
              <span className="rounded-md bg-yellow px-2 py-0.5 text-[11px] font-extrabold text-navy">
                REPORTED
              </span>
            </span>
          }
        />
        <Row
          label="Verified qty"
          value={verified ? "2 tonnes" : "OPEN"}
          valueClass={verified ? "text-green-700" : "text-red-700"}
        />
        <Row
          label="Quality"
          value={verified ? "VERIFIED" : "REPORTED only"}
          valueClass={verified ? "text-green-700" : "text-amber-700"}
        />
        <Row
          label="Evidence"
          value={
            <span className="inline-flex items-center gap-1.5 rounded-lg bg-slate-100 px-2.5 py-1.5 text-slate-700">
              <Paperclip className="size-4" aria-hidden />
              {evidenceCount === 0 ? "None attached" : `${evidenceCount} of 3 on file`}
            </span>
          }
        />
      </Card>
      <Card icon={<Handshake className="size-4" aria-hidden />} title="LINKED BUYER">
        <Row label="Buyer" value="Lira Miller Co." />
      </Card>
      <Card icon={<ShieldCheck className="size-4" aria-hidden />} title="MATCH STATUS">
        <Row
          label="Match"
          value={verified ? "VALIDATED" : "NOT VALIDATED"}
          valueClass={verified ? "text-green-700" : "text-orange"}
        />
      </Card>
    </Screen>
  );
}

/* ---------- screen 3: evidence & blockers ---------- */

function CheckBox({ on }: { on: boolean }) {
  return (
    <span
      className={
        "grid size-6 shrink-0 place-items-center rounded-md border-2 " +
        (on ? "border-forest bg-forest text-white" : "border-slate-300 bg-white")
      }
    >
      {on ? <Check className="size-4" aria-hidden /> : null}
    </span>
  );
}

function CheckRow({
  label,
  on,
  onToggle,
}: {
  label: string;
  on: boolean;
  onToggle: () => void;
}) {
  return (
    <button
      type="button"
      role="checkbox"
      aria-checked={on}
      onClick={onToggle}
      className="flex min-h-14 w-full items-center gap-3 border-b border-slate-200 text-left text-base"
    >
      <CheckBox on={on} />
      {label}
    </button>
  );
}

function EvidenceScreen({
  fee,
  weigh,
  quality,
  stock,
  blocker,
  onFee,
  onWeigh,
  onQuality,
  onStock,
}: {
  fee: Fee;
  weigh: boolean;
  quality: boolean;
  stock: boolean;
  blocker: { long: string; short: string } | null;
  onFee: (fee: Fee) => void;
  onWeigh: () => void;
  onQuality: () => void;
  onStock: () => void;
}) {
  const options: { id: Exclude<Fee, null>; label: string }[] = [
    { id: "yes", label: "YES" },
    { id: "no", label: "NO" },
    { id: "counter", label: "COUNTER" },
  ];
  return (
    <Screen
      header={
        <Header
          tone="green"
          left={<Menu className="size-6 shrink-0" aria-hidden />}
          center={
            <div className="mx-auto w-fit rounded-lg border-2 border-white px-4 py-1 text-sm font-extrabold tracking-wider">
              ILLUSTRATIVE
            </div>
          }
          right={
            <span className="relative shrink-0">
              <Bell className="size-6" aria-hidden />
              <span className="absolute -right-0.5 -top-0.5 size-2.5 rounded-full bg-red-500" />
            </span>
          }
        />
      }
      footer={
        <div className="shrink-0">
          <div
            className={
              "mx-3 mb-2 flex min-h-12 items-center justify-center gap-3 rounded-xl text-lg font-extrabold tracking-wide text-white " +
              (blocker ? "bg-red-600" : "bg-green-700")
            }
          >
            {blocker ? (
              <>
                <AlertCircle className="size-6" aria-hidden />
                BLOCKED
                <Lock className="size-5" aria-hidden />
              </>
            ) : (
              <>
                <ShieldCheck className="size-6" aria-hidden />
                READY FOR CHECK
              </>
            )}
          </div>
          <div
            aria-hidden
            className="grid grid-cols-4 border-t border-slate-200 bg-white pb-2 pt-1.5 text-center text-[10px] font-bold tracking-wide text-slate-500"
          >
            {[
              { l: "DEAL DESK", i: <Package className="mx-auto size-5" />, on: true },
              { l: "DEAL", i: <FileText className="mx-auto size-5" />, on: false },
              { l: "STOCK", i: <Sprout className="mx-auto size-5" />, on: false },
              { l: "MORE", i: <User className="mx-auto size-5" />, on: false },
            ].map((t) => (
              <div key={t.l} className={t.on ? "text-forest" : ""}>
                {t.i}
                {t.l}
              </div>
            ))}
          </div>
        </div>
      }
    >
      <div>
        <h2 className="text-2xl font-extrabold leading-tight tracking-tight">
          EVIDENCE AND BLOCKERS
        </h2>
        <p className="mt-1 text-sm text-slate-600">
          Review required evidence and items blocking this deal.
        </p>
      </div>
      <div className="rounded-2xl border border-slate-200 bg-white px-3">
        <div className="flex min-h-14 items-center gap-3 border-b border-slate-200">
          <CheckBox on={fee === "yes"} />
          <span className="text-base">Buyer fee</span>
          <div className="ml-auto flex gap-1.5" role="radiogroup" aria-label="Buyer fee response">
            {options.map((o) => (
              <button
                key={o.id}
                type="button"
                role="radio"
                aria-checked={fee === o.id}
                onClick={() => onFee(o.id)}
                className={
                  "min-h-9 rounded-full border px-2.5 text-[11px] font-bold " +
                  (fee === o.id
                    ? "border-forest bg-green-100 text-forest"
                    : "border-slate-300 bg-white text-slate-700")
                }
              >
                {o.label}
              </button>
            ))}
          </div>
        </div>
        <CheckRow label="Weigh ticket" on={weigh} onToggle={onWeigh} />
        <CheckRow label="Quality moisture result" on={quality} onToggle={onQuality} />
        <CheckRow label="Stock authority" on={stock} onToggle={onStock} />
        <div className="flex min-h-14 items-center gap-3">
          <CheckBox on />
          <span className="text-base">Buyer requirement captured</span>
          <Check className="ml-auto size-5 text-forest" aria-hidden />
        </div>
      </div>
      {blocker ? (
        <div className="flex items-center gap-3 rounded-2xl border border-red-300 bg-red-50 p-3.5 text-red-700">
          <TriangleAlert className="size-9 shrink-0" aria-hidden />
          <p className="text-base font-extrabold leading-snug">
            BLOCKER: <br />
            {blocker.long}
          </p>
        </div>
      ) : (
        <div className="flex items-center gap-3 rounded-2xl border border-green-300 bg-green-50 p-3.5 text-green-800">
          <ShieldCheck className="size-9 shrink-0" aria-hidden />
          <p className="text-base font-extrabold leading-snug">
            All evidence in place. Waiting for an authorised check. Nothing is paid.
          </p>
        </div>
      )}
      <p className="flex items-center gap-2 text-xs text-slate-600">
        <Info className="size-5 shrink-0 text-forest" aria-hidden />
        Uploading a photo does NOT automatically verify stock or make the deal executable.
      </p>
    </Screen>
  );
}

/* ---------- screen 4: approval ---------- */

function ApprovalScreen({
  decision,
  action,
  blocker,
  gate,
  onChoose,
}: {
  decision: Decision;
  action: Action;
  blocker: { long: string; short: string } | null;
  gate: string | null;
  onChoose: (a: Exclude<Action, null>) => void;
}) {
  const current = decision === "verified" ? "VERIFIED" : decision === "rejected" ? "REJECTED" : "REPORTED";
  const currentClass =
    decision === "verified" ? "text-green-700" : decision === "rejected" ? "text-red-700" : "text-blue-700";
  const choices: { id: Exclude<Action, null>; pre: string; strong?: string }[] = [
    { id: "checked", pre: "Mark evidence checked" },
    { id: "verify", pre: "Move to ", strong: "VERIFIED" },
    { id: "reject", pre: "Reject batch / quantity" },
    { id: "return", pre: "Return to ", strong: "REPORTED" },
  ];
  const status =
    decision === "verified"
      ? "VERIFIED BY AUTHORISED CHECK"
      : decision === "rejected"
        ? "BATCH REJECTED"
        : "AWAITING AUTHORISED CHECK";
  return (
    <Screen
      header={
        <Header
          tone="navy"
          left={<Menu className="size-6 shrink-0" aria-hidden />}
          center={
            <div className="text-center">
              <p className="text-[11px] font-bold tracking-[0.25em]">— ILLUSTRATIVE —</p>
              <h2 className="mt-1 text-3xl font-extrabold tracking-wide">APPROVAL</h2>
              <p className="mt-1 inline-flex items-center gap-1.5 text-sm">
                <ShieldCheck className="size-4" aria-hidden />
                Deal Desk
              </p>
            </div>
          }
          right={<span className="w-6 shrink-0" aria-hidden />}
        />
      }
    >
      <section className="rounded-2xl border border-slate-200 bg-white p-3.5 shadow-sm">
        <div className="flex items-center gap-3 border-b border-slate-200 pb-3">
          <span className="grid size-9 shrink-0 place-items-center rounded-full bg-navy text-white">
            <FileText className="size-4" aria-hidden />
          </span>
          <p className="text-sm font-bold">
            Current status: <span className={currentClass}>{current}</span>
          </p>
        </div>
        <div className="flex items-center gap-3 pt-3 text-sm">
          <AlertCircle
            className={"size-7 shrink-0 " + (blocker ? "text-red-600" : "text-green-700")}
            aria-hidden
          />
          <p>
            <span className={"font-bold " + (blocker ? "text-red-600" : "text-green-700")}>
              {blocker ? "Blocker" : "No blocker"}
            </span>{" "}
            {blocker ? blocker.short : ""}
          </p>
        </div>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-3.5 shadow-sm">
        <h2 className="border-b border-slate-200 pb-2 text-base font-extrabold">
          Choose action <span className="text-xs font-semibold text-slate-500">(authorised user only)</span>
        </h2>
        <div role="radiogroup" aria-label="Approval action">
          {choices.map((c) => (
            <button
              key={c.id}
              type="button"
              role="radio"
              aria-checked={action === c.id}
              onClick={() => onChoose(c.id)}
              className="flex min-h-12 w-full items-center gap-3 border-b border-slate-100 text-left text-sm last:border-0"
            >
              <span
                className={
                  "grid size-6 shrink-0 place-items-center rounded-full border-2 " +
                  (action === c.id ? "border-blue-700 bg-blue-700 text-white" : "border-slate-400")
                }
              >
                {action === c.id ? <Check className="size-3.5" aria-hidden /> : null}
              </span>
              <span>
                {c.pre}
                {c.strong ? <strong className="text-blue-700">{c.strong}</strong> : null}
              </span>
            </button>
          ))}
        </div>
      </section>

      {gate ? (
        <p className="flex items-start gap-2 rounded-2xl border border-red-300 bg-red-50 p-3 text-sm font-semibold text-red-700">
          <TriangleAlert className="mt-0.5 size-5 shrink-0" aria-hidden />
          <span>Cannot move to VERIFIED. {gate}. Status was not upgraded.</span>
        </p>
      ) : null}
      {action === "checked" && blocker && !gate ? (
        <p className="flex items-start gap-2 rounded-2xl border border-slate-200 bg-white p-3 text-sm text-slate-700">
          <Info className="mt-0.5 size-5 shrink-0 text-blue-700" aria-hidden />
          <span>Evidence marked as checked. Open item: {blocker.short}.</span>
        </p>
      ) : null}

      <div className="flex items-start gap-3 rounded-2xl border border-amber-300 bg-amber-50 p-3.5">
        <TriangleAlert className="size-8 shrink-0 text-amber-600" aria-hidden />
        <p className="text-sm leading-snug">
          <strong>App does NOT auto-mark:</strong> stock exists, funds available, farmer paid.
        </p>
      </div>

      <section className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white p-3.5 shadow-sm">
        <span className="grid size-10 shrink-0 place-items-center rounded-full bg-navy text-white">
          <Hourglass className="size-5" aria-hidden />
        </span>
        <div>
          <p className="text-[11px] font-bold tracking-wide text-slate-500">STATUS</p>
          <p className="text-sm font-extrabold tracking-wide text-navy">{status}</p>
        </div>
      </section>
    </Screen>
  );
}

/* ---------- screen 5: reconciliation ---------- */

function ReconcileScreen({ decision, fee }: { decision: Decision; fee: Fee }) {
  const rejected = decision === "rejected";
  const accepted = rejected ? 0 : TONNES;
  const rejectedQty = rejected ? TONNES : 0;
  const commodity = accepted * 1000 * PRICE_PER_KG;
  const perTonne = accepted * PER_TONNE_FEE;
  const feeTotal = rejected
    ? fee === "yes"
      ? VERIFICATION_FEE
      : 0
    : Math.max(perTonne, VERIFICATION_FEE);
  const contribution = feeTotal - VISIT_COST;
  const chip = rejected
    ? fee === "yes"
      ? "MINIMUM FEE APPLIED"
      : "NO FEE ACCEPTED"
    : "CREDIT RULE APPLIED";

  return (
    <Screen
      header={
        <Header
          tone="green"
          left={<ArrowLeft className="size-5 shrink-0" aria-hidden />}
          center={
            <div>
              <p className="text-[11px] font-bold tracking-[0.2em]">ILLUSTRATIVE</p>
              <h2 className="text-2xl font-extrabold tracking-wide">RECONCILIATION</h2>
              <p className="mt-1 inline-flex items-center gap-1.5 text-sm">
                <Sprout className="size-4" aria-hidden />
                Agricultural Deal Desk
              </p>
            </div>
          }
          right={<ShieldCheck className="size-6 shrink-0" aria-hidden />}
        >
          <svg
            aria-hidden
            viewBox="0 0 200 80"
            className="pointer-events-none absolute bottom-0 right-0 h-16 w-40 opacity-60"
          >
            <path d="M0 80 Q50 28 110 54 T200 34 V80Z" fill="#2f7d4f" />
            <path d="M30 80 Q80 52 130 68 T200 58 V80Z" fill="#245c3b" />
          </svg>
          <Tractor
            aria-hidden
            className="pointer-events-none absolute bottom-3 right-4 size-8 text-yellow"
          />
        </Header>
      }
      footer={
        <div className="flex min-h-14 shrink-0 items-center justify-center gap-3 bg-forest text-sm font-extrabold tracking-wide text-white">
          <Check className="size-5" aria-hidden />
          ILLUSTRATIVE RECONCILE
        </div>
      }
    >
      <section className="grid grid-cols-2 divide-x divide-slate-200 rounded-2xl border border-slate-200 bg-white p-3 shadow-sm">
        <div className="flex items-center gap-2.5 pr-2">
          <span className="grid size-10 shrink-0 place-items-center rounded-full bg-green-100 text-green-700">
            <Check className="size-5" aria-hidden />
          </span>
          <div>
            <p className="text-[10px] font-bold tracking-wide text-slate-500">ACCEPTED QUANTITY</p>
            <p className="text-2xl font-extrabold text-green-700">{accepted.toFixed(1)} t</p>
          </div>
        </div>
        <div className="flex items-center gap-2.5 pl-3">
          <span className="grid size-10 shrink-0 place-items-center rounded-full bg-red-100 text-red-600">
            <X className="size-5" aria-hidden />
          </span>
          <div>
            <p className="text-[10px] font-bold tracking-wide text-slate-500">REJECTED</p>
            <p className="text-2xl font-extrabold text-red-600">
              {rejectedQty === 0 ? "0" : rejectedQty.toFixed(1) + " t"}
            </p>
          </div>
        </div>
      </section>

      <section className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white p-3.5 shadow-sm">
        <span className="grid size-10 shrink-0 place-items-center rounded-full bg-green-100 text-green-700">
          <Sprout className="size-5" aria-hidden />
        </span>
        <div>
          <p className="text-sm font-extrabold">COMMODITY</p>
          <p className="text-xs text-slate-500">(Not CNG income)</p>
        </div>
        <div className="ml-auto text-right">
          <p className="text-[10px] font-bold text-slate-500">VALUE @ 1,350/kg</p>
          <p className="text-lg font-extrabold">
            {num(commodity)} <span className="text-xs font-semibold">UGX</span>
          </p>
        </div>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-3.5 shadow-sm">
        <div className="flex items-center gap-3">
          <span className="grid size-10 shrink-0 place-items-center rounded-full bg-green-100 text-green-700">
            <ReceiptText className="size-5" aria-hidden />
          </span>
          <p className="text-sm font-extrabold">CNG SERVICE FEE</p>
          <div className="ml-auto text-right">
            <p className="text-[10px] font-bold text-slate-500">VERIFICATION</p>
            <p className="text-lg font-extrabold text-green-700">{num(VERIFICATION_FEE)}</p>
          </div>
        </div>
        <div className="mt-3 rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm">
          <div className="flex items-center justify-between">
            <span>
              {accepted}t × {num(PER_TONNE_FEE)}
            </span>
            <span className="font-bold">= {num(perTonne)}</span>
          </div>
          <div className="mt-2 flex items-end justify-between">
            <div>
              <span className="rounded-md bg-green-100 px-2 py-0.5 text-[10px] font-extrabold text-green-800">
                {chip}
              </span>
              <p className="mt-1 text-xs text-slate-600">Total service fee</p>
              <p className="text-[10px] text-slate-500">25k not added again on top</p>
            </div>
            <p className="text-xl font-extrabold text-green-700">{num(feeTotal)}</p>
          </div>
        </div>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-3.5 shadow-sm">
        <div className="flex items-center gap-3">
          <span className="grid size-10 shrink-0 place-items-center rounded-full bg-green-100 text-green-700">
            <Wallet className="size-5" aria-hidden />
          </span>
          <p className="text-sm font-extrabold">CNG COSTS (EXAMPLE)</p>
        </div>
        <Row label="Visit transport + airtime" value={num(VISIT_COST)} />
        <Row label="Other logistics" value="OPEN" valueClass="text-amber-600" />
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white px-3.5 shadow-sm">
        <div className="flex items-center gap-3 border-b border-slate-100 py-3">
          <span className="grid size-9 shrink-0 place-items-center rounded-full bg-blue-100 text-blue-700">
            <Users className="size-4" aria-hidden />
          </span>
          <div>
            <p className="text-sm font-extrabold">CASH CONTRIBUTION</p>
            <p className="text-[10px] text-slate-500">if fee collected, visit-only costs</p>
          </div>
          <p
            className={
              "ml-auto text-lg font-extrabold " + (contribution > 0 ? "text-green-700" : "text-red-600")
            }
          >
            {signed(contribution)}
          </p>
        </div>
        <div className="flex items-center gap-3 border-b border-slate-100 py-3">
          <span className="grid size-9 shrink-0 place-items-center rounded-full bg-purple-100 text-purple-700">
            <FileText className="size-4" aria-hidden />
          </span>
          <p className="text-sm font-extrabold">PAYMENT EVIDENCE</p>
          <p className="ml-auto text-sm font-extrabold text-blue-700">EXTERNAL</p>
        </div>
        <div className="flex items-center gap-3 py-3">
          <span className="grid size-9 shrink-0 place-items-center rounded-full bg-slate-100 text-slate-600">
            <CircleHelp className="size-5" aria-hidden />
          </span>
          <p className="text-sm font-extrabold">CNG HOLDS CUSTOMER FUNDS?</p>
          <p className="ml-auto text-sm font-extrabold text-red-600">NO</p>
        </div>
      </section>
    </Screen>
  );
}
