"use client"

import React, { useRef, useState } from "react"
import { Loader2 } from "lucide-react"
import { Configuration, OpenAIApi } from "openai"
import { CodeBlock, sunburst } from "react-code-blocks"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"

export default function IndexPage() {
  let model = "gpt-3.5-turbo"
  let [md, setMd] = useState("# Hello")
  let [sent, setSent] = useState(false)

  async function getDoc() {
    let key: string = (document.getElementById("pwr") as HTMLInputElement).value

    if (key === "") {
      alert("Specify a valid key.")
      return
    }
    let template = (
      document.getElementById("templatetxt") as HTMLTextAreaElement
    ).value
    let codeSn = (document.getElementById("codesnippet") as HTMLTextAreaElement)
      .value
    const configuration = new Configuration({
      apiKey: key,
    })
    const openai = new OpenAIApi(configuration)
    setSent(true)
    try {
      const completion = await openai.createChatCompletion({
        model: model,
        messages: [
          {
            role: "system",
            content:
              "GOAL: Generate markdown documentation for code snippets using this template: " +
              template,
          },
          {
            role: "user",
            content:
              "Generate the markdown documentation for this code: \n" + codeSn,
          },
        ],
      })
      let res = completion.data.choices[0].message?.content
      setMd(res ?? "An error occured")
      setSent(false)
    } catch (error) {
      alert("An error occured:\n" + error)
    }
  }

  function onModelChange(v: string) {
    model = v
  }
  const sectionRef = useRef<HTMLElement | null>(null)

  function scrollToSection() {
    if (sectionRef.current) {
      sectionRef.current.scrollIntoView({ behavior: "smooth" })
    }
  }

  return (
    <div className="container">
      <section className="flex min-h-screen flex-col items-center justify-center">
        <h1 className="text-5xl font-bold ">
          Create documentation easily with AI.
        </h1>
        <p className="text-slate-500">
          Document your products using OpenAI&apos;s GPT-4 models.
        </p>
        <Button className="m-2" onClick={scrollToSection}>
          Get started
        </Button>
      </section>
      <section
        ref={sectionRef}
        className="m-2 grid grid-cols-2 space-x-2 rounded-lg p-5 shadow-lg dark:bg-slate-900"
      >
        <div>
          <Tabs defaultValue="code">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="code">Code</TabsTrigger>
              <TabsTrigger value="preview">Preview</TabsTrigger>
            </TabsList>
            <TabsContent value="code" className="h-full w-full">
              <div style={{ fontFamily: "consolas" }}>
                <CodeBlock
                  text={md}
                  language="markdown"
                  wrapLines
                  showLineNumbers={false}
                  theme={sunburst}
                />
              </div>
              <div
                className={
                  sent
                    ? "m-4 flex flex-col items-center justify-center rounded-md p-8 shadow-md sm:m-16"
                    : "hidden"
                }
              >
                <Loader2 className="mr-4 animate-spin" size={48} />
                <p>Please wait</p>
              </div>
            </TabsContent>

            <TabsContent value="preview">Soon</TabsContent>
          </Tabs>
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-bold">Settings</h2>
          <h3 className="text-xl font-bold">Template</h3>
          <Textarea
            id="templatetxt"
            placeholder="Paste your markdown documentation template here."
          />
          <h3 className="text-xl font-bold">Code Snippet</h3>
          <Textarea
            id="codesnippet"
            placeholder="Paste your code snippet here."
          />
          <h3 className="text-xl font-bold">Model</h3>
          <div className="flex items-center space-x-2">
            <p>Key</p>
            <Input id="pwr" />
          </div>
          <Select onValueChange={onModelChange} defaultValue="gpt-3.5-turbo">
            <SelectTrigger>
              <SelectValue placeholder="Select a model" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="gpt-3.5-turbo">gpt-3.5-turbo</SelectItem>
              <SelectItem value="gpt-4">gpt-4</SelectItem>
            </SelectContent>
          </Select>
          <div className="m-4 flex justify-center">
            <Button onClick={getDoc}>
              <Loader2
                className={
                  sent ? "mr-4 animate-spin" : "mr-4 hidden animate-spin"
                }
              />
              {!sent ? "Generate" : "Please wait"}
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}
