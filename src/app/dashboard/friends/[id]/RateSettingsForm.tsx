"use client";

import { Input } from "@/components/input";
import { ArrowHeadDown, ArrowHeadUp } from "@/components/symbols/arrow";
import MessageText from "@/components/text/messageText";
import { checkApy, checkCycles, checkMinDebtAge, checkNextDate } from "@/utils/validation";
import React, { useEffect, useState } from "react";

export default function RateSettingsForm({ friend_id }: Readonly<{ friend_id: number }>) {
  const [initialised, setInitialised] = useState<boolean>(false);

  const [apy, setAPY] = useState<number>(0);
  const [cycles, setCycles] = useState<number>(7);
  const [minDebtAge, setMinDebtAge] = useState<number>(14);
  const [minAmount, setMinAmount] = useState<number>(0);
  const [nextDate, setNextDate] = useState<Date>(new Date());
  const [showAllSettings, setShowAllSettings] = useState<boolean>(false);

  const [message, setMessage] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchValues = async () => {
      try {
        const res = await fetch(`/api/friend/settings/${friend_id}/`);
        const data = await res.json();

        if (res.ok) {
          setAPY(data?.settings?.apy);
          setCycles(data?.settings?.cycles);
          setMinDebtAge(data?.settings?.minDebtAge);
          setMinAmount(data?.settings?.minAmount);
          setNextDate(new Date(data.settings.nextDate));
        } else {
          setMessage(data.message);
          setTimeout(() => setMessage(""), 10_000);
        }
      } catch (error) {
        if (error instanceof TypeError) {
          setMessage("Error: " + error.message);
          setTimeout(() => setMessage(""), 20_000);
        } else {
          throw error;
        }
      }
    };

    if (!initialised)
      fetchValues().then(() => {
        setLoading(false);
        setInitialised(true);
      });
  }, [initialised, friend_id]);

  const handleSubmit = async function (event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setLoading(true);

    try {
      const nextDateISO = nextDate.toISOString();
      const res = await fetch(`/api/friend/settings/${friend_id}/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ settings: { apy, cycles, minDebtAge, minAmount, nextDate: nextDateISO } }),
      });

      const data = await res.json();

      if (res.ok) {
        setAPY(data?.settings?.apy || 0);
        setCycles(data?.settings?.cycles || 7);
        setMinDebtAge(data?.settings?.minDebtAge || 14);
        setMinAmount(data?.settings?.minAmount || 0);
        setNextDate(new Date(data.settings.nextDate));

        setMessage(data.message);
        setTimeout(() => setMessage(""), 5000);
      } else {
        /*
        const formattedErrors = Object.entries(data.errors)
          .map(([key, error]: [string, unknown]) => {
            if (error instanceof Error) return `${key}: ${error.message}`;
            return `${key}: ${error}`;
          })
          .join("\n");
*/

        setMessage("Error: " + data?.message + ": " + data?.error);
        setTimeout(() => setMessage(""), 10000);
        console.error(data);
      }
    } catch (error) {
      if (error instanceof TypeError) {
        setMessage("Error: " + error.message);
      } else {
        throw error;
      }
      setTimeout(() => setMessage(""), 10000);
    }

    setLoading(false);
  };

  return (
    <form className="flex max-w-lg flex-col" onSubmit={handleSubmit}>
      {/* APY */}
      <div className="md:mx-auto">
        <label htmlFor="setting-slider" className="mb-2 block text-sm font-bold">
          Annual percentage yield (%)
        </label>
        <div className="md:flex">
          <input
            id="setting-slider"
            type="range"
            className="w-full md:mr-2"
            min="0"
            max="150"
            value={apy}
            disabled={loading}
            onChange={(e) => setAPY(e.target.valueAsNumber)}
          />
          <Input
            id="apy"
            type="number"
            placeholder="APY (%)"
            className="md:w-24"
            min={0}
            value={apy}
            disabled={loading}
            onChange={(e) => setAPY(e.target.valueAsNumber)}
            inputError={checkApy(apy)}
          />
        </div>
      </div>

      {/* See more */}
      <button
        className="mx-auto my-3 flex font-mono shadow-sm"
        type="button"
        onClick={() => setShowAllSettings(!showAllSettings)}
      >
        {showAllSettings ? (
          <>
            <p className="mr-2">Hide all settings</p>
            <ArrowHeadUp />
          </>
        ) : (
          <>
            <p className="mr-2">Show all settings</p>
            <ArrowHeadDown />
          </>
        )}
      </button>

      {showAllSettings && (
        <>
          <div className="md:flex">
            {/* Number input for cycles */}
            <Input
              type="number"
              id="cycles-input"
              label="Days between two interests"
              className="mb-4 md:mr-2"
              min={1}
              max={365}
              value={cycles}
              disabled={loading}
              onChange={(e) => setCycles(e.target.valueAsNumber)}
              inputError={checkCycles(cycles)}
            />

            {/* Number input for min age of days */}
            <Input
              type="number"
              id="min-age-input"
              label="min. Debt Age in Days"
              className="mb-4 md:ml-2"
              min={0}
              max={365}
              value={minDebtAge}
              disabled={loading}
              onChange={(e) => setMinDebtAge(e.target.valueAsNumber)}
              inputError={checkMinDebtAge(minDebtAge)}
            />
          </div>

          <div className="md:flex">
            {/* min amount */}
            <Input
              type="number"
              id="min-amount"
              label="min. Amount"
              className="mb-4 md:mr-2"
              min={0}
              step={0.01}
              value={minAmount}
              disabled={loading}
              onChange={(e) => setMinAmount(e.target.valueAsNumber)}
            />

            {/* Date input */}
            <Input
              type="date"
              id="start-date"
              label="Next Date"
              className="mb-4 md:ml-2"
              value={nextDate.toISOString().split("T")[0]} // Format the date in YYYY-MM-DD format
              disabled={loading}
              onChange={(e) => {
                if (e.target.value) setNextDate(new Date(e.target.value + "T00:00:00Z"));
              }}
              inputError={checkNextDate(nextDate)}
            />
          </div>
        </>
      )}

      <button className="btn_save mx-auto" disabled={loading} type="submit">
        save
      </button>
      <MessageText message={message} />
    </form>
  );
}
