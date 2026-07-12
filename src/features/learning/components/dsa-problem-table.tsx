import {
  CheckCircle2,
  ListFilter,
  Plus,
  RotateCcw,
  SearchX,
} from "lucide-react"
import { useMemo, useState } from "react"

import { EmptyState } from "@/components/common/empty-state"
import { FilterBar } from "@/components/common/filter-bar"
import { SearchInput } from "@/components/common/search-input"
import { StatusBadge } from "@/components/common/status-badge"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useLearningStore } from "@/store/learning-store"
import type {
  DsaProblem,
  ProblemDifficulty,
  ProblemStatus,
} from "@/types/learning"

const difficultyTone: Record<
  ProblemDifficulty,
  "success" | "warning" | "danger"
> = {
  Easy: "success",
  Medium: "warning",
  Hard: "danger",
}

const statusTone: Record<
  ProblemStatus,
  "neutral" | "info" | "success" | "warning"
> = {
  "Not started": "neutral",
  Attempted: "warning",
  Solved: "success",
  Revising: "info",
}

const statuses: ProblemStatus[] = [
  "Not started",
  "Attempted",
  "Solved",
  "Revising",
]
const difficulties: ProblemDifficulty[] = ["Easy", "Medium", "Hard"]

interface ProblemRowProps {
  problem: DsaProblem
}

function ProblemRow({ problem }: ProblemRowProps) {
  const updateProblem = useLearningStore((state) => state.updateProblem)

  return (
    <tr className="border-b border-border/70 transition-colors last:border-0 hover:bg-white/[0.018]">
      <td className="min-w-64 px-4 py-4 align-top">
        <div className="font-medium text-foreground">{problem.name}</div>
        <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
          <span>{problem.platform}</span>
          <span aria-hidden="true">·</span>
          <span>{problem.pattern}</span>
        </div>
      </td>
      <td className="px-3 py-4 align-top">
        <StatusBadge tone={difficultyTone[problem.difficulty]}>
          {problem.difficulty}
        </StatusBadge>
      </td>
      <td className="min-w-44 px-3 py-3 align-top">
        <Select
          value={problem.status}
          onValueChange={(value) =>
            updateProblem(problem.id, { status: value as ProblemStatus })
          }
        >
          <SelectTrigger
            className="h-8 border-transparent bg-secondary/65 text-xs"
            aria-label={`Status for ${problem.name}`}
          >
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {statuses.map((status) => (
              <SelectItem key={status} value={status}>
                <span className="flex items-center gap-2">
                  <StatusBadge tone={statusTone[status]}>{status}</StatusBadge>
                </span>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </td>
      <td className="px-3 py-3 align-top">
        <div className="flex items-center gap-1.5">
          <span className="w-5 text-center text-sm tabular-nums">
            {problem.attempts}
          </span>
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            aria-label={`Record another attempt for ${problem.name}`}
            onClick={() =>
              updateProblem(problem.id, {
                attempts: problem.attempts + 1,
                status:
                  problem.status === "Not started"
                    ? "Attempted"
                    : problem.status,
                lastAttemptedAt: new Date().toISOString(),
              })
            }
          >
            <Plus aria-hidden="true" />
          </Button>
        </div>
      </td>
      <td className="px-3 py-4 text-center align-top">
        <Checkbox
          checked={problem.solvedIndependently}
          onCheckedChange={(checked) =>
            updateProblem(problem.id, { solvedIndependently: checked === true })
          }
          aria-label={`${problem.name} solved independently`}
        />
      </td>
      <td className="min-w-44 px-3 py-3 align-top">
        <div className="flex items-center gap-3">
          <input
            type="range"
            min={0}
            max={100}
            step={5}
            value={problem.confidence}
            onChange={(event) =>
              updateProblem(problem.id, {
                confidence: Number(event.target.value),
              })
            }
            className="h-1.5 w-24 cursor-pointer accent-primary"
            aria-label={`Confidence for ${problem.name}`}
          />
          <span className="w-9 text-right text-xs font-medium tabular-nums text-muted-foreground">
            {problem.confidence}%
          </span>
        </div>
      </td>
      <td className="min-w-40 px-3 py-3 align-top">
        <Input
          type="date"
          value={problem.revisionDate}
          onChange={(event) =>
            updateProblem(problem.id, { revisionDate: event.target.value })
          }
          className="h-8 border-transparent bg-secondary/65 text-xs"
          aria-label={`Revision date for ${problem.name}`}
        />
      </td>
    </tr>
  )
}

export function DsaProblemTable() {
  const problems = useLearningStore((state) => state.problems)
  const [query, setQuery] = useState("")
  const [difficulty, setDifficulty] = useState<ProblemDifficulty | "all">("all")
  const [status, setStatus] = useState<ProblemStatus | "all">("all")

  const filteredProblems = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase()
    return problems.filter((problem) => {
      const matchesQuery =
        !normalizedQuery ||
        `${problem.name} ${problem.pattern} ${problem.platform}`
          .toLowerCase()
          .includes(normalizedQuery)
      const matchesDifficulty =
        difficulty === "all" || problem.difficulty === difficulty
      const matchesStatus = status === "all" || problem.status === status
      return matchesQuery && matchesDifficulty && matchesStatus
    })
  }, [difficulty, problems, query, status])

  const resetFilters = () => {
    setQuery("")
    setDifficulty("all")
    setStatus("all")
  }

  return (
    <div>
      <FilterBar className="mb-4">
        <SearchInput
          value={query}
          onChange={setQuery}
          placeholder="Search problems or patterns…"
          className="min-w-0 flex-1 sm:min-w-64"
        />
        <Select
          value={difficulty}
          onValueChange={(value) =>
            setDifficulty(value as ProblemDifficulty | "all")
          }
        >
          <SelectTrigger
            className="w-full sm:w-40"
            aria-label="Filter by difficulty"
          >
            <ListFilter
              aria-hidden="true"
              className="mr-2 size-4 text-muted-foreground"
            />
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All difficulties</SelectItem>
            {difficulties.map((item) => (
              <SelectItem key={item} value={item}>
                {item}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select
          value={status}
          onValueChange={(value) => setStatus(value as ProblemStatus | "all")}
        >
          <SelectTrigger
            className="w-full sm:w-40"
            aria-label="Filter by status"
          >
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All statuses</SelectItem>
            {statuses.map((item) => (
              <SelectItem key={item} value={item}>
                {item}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </FilterBar>

      {filteredProblems.length === 0 ? (
        <EmptyState
          icon={SearchX}
          title="No matching problems"
          description="Try a broader search or clear the active filters."
          action={
            <Button type="button" variant="outline" onClick={resetFilters}>
              <RotateCcw aria-hidden="true" />
              Reset filters
            </Button>
          }
        />
      ) : (
        <div className="overflow-x-auto rounded-xl border border-border/70">
          <table className="w-full border-collapse text-left text-sm">
            <caption className="sr-only">
              DSA practice problems and revision controls
            </caption>
            <thead className="bg-secondary/45 text-[11px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">
              <tr>
                <th scope="col" className="px-4 py-3">
                  Problem & pattern
                </th>
                <th scope="col" className="px-3 py-3">
                  Difficulty
                </th>
                <th scope="col" className="px-3 py-3">
                  Status
                </th>
                <th scope="col" className="px-3 py-3">
                  Attempts
                </th>
                <th scope="col" className="px-3 py-3 text-center">
                  Independent
                </th>
                <th scope="col" className="px-3 py-3">
                  Confidence
                </th>
                <th scope="col" className="px-3 py-3">
                  Revision
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredProblems.map((problem) => (
                <ProblemRow key={problem.id} problem={problem} />
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div className="mt-3 flex items-center gap-2 text-xs text-muted-foreground">
        <CheckCircle2 aria-hidden="true" className="size-3.5 text-success" />
        Showing {filteredProblems.length} of {problems.length} problems ·
        changes persist for this session
      </div>
    </div>
  )
}
