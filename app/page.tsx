"use client"

import React, { useRef, useState } from "react"
import dynamic from "next/dynamic"
import { MarkdownPreviewProps } from "@uiw/react-markdown-preview"
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

import "@uiw/react-textarea-code-editor/dist.css"
import { useTheme } from "next-themes"

const MarkdownPreview = dynamic<MarkdownPreviewProps>(
  () => import("@uiw/react-markdown-preview"),
  {
    ssr: false,
  }
)

const CodeEditor = dynamic(
  () => import("@uiw/react-textarea-code-editor").then((mod) => mod.default),
  { ssr: false }
)
export default function IndexPage() {
  const { theme } = useTheme()
  const languages = [
    "abap",
    "aes",
    "apex",
    "bat",
    "bicep",
    "brainfuck",
    "c",
    "cameligo",
    "clike",
    "clojure",
    "coffeescript",
    "cpp",
    "csharp",
    "csp",
    "css",
    "dart",
    "dockerfile",
    "ecl",
    "elixir",
    "erlang",
    "flow9",
    "fsharp",
    "freemarker2",
    "go",
    "graphql",
    "handlebars",
    "hcl",
    "html",
    "ini",
    "java",
    "javascript",
    "json",
    "jsx",
    "julia",
    "kotlin",
    "less",
    "lex",
    "lexon",
    "liquid",
    "livescript",
    "lua",
    "m3",
    "markdown",
    "mips",
    "msdax",
    "mysql",
    "nginx",
    "pascal",
    "pascaligo",
    "perl",
    "php",
    "pla",
    "plaintext",
    "postiats",
    "powerquery",
    "powershell",
    "proto",
    "pug",
    "python",
    "qsharp",
    "r",
    "razor",
    "redis",
    "redshift",
    "restructuredtext",
    "ruby",
    "rust",
    "sb",
    "scala",
    "scheme",
    "scss",
    "shell",
    "sol",
    "sparql",
    "sql",
    "st",
    "stylus",
    "swift",
    "systemverilog",
    "tcl",
    "toml",
    "tsx",
    "twig",
    "typescript",
    "vb",
    "vbscript",
    "verilog",
    "xml",
    "yaml",
  ]
  let model = "gpt-3.5-turbo"
  const [md, setMd] = useState("# Hello")
  const [sent, setSent] = useState(false)
  const [template, setTemplate] = React.useState(``)
  const [codeSn, setCodeSn] = useState("")
  const [lang, setLang] = useState("js")

  async function getDoc() {
    let key: string = (document.getElementById("pwr") as HTMLInputElement).value

    if (key === "") {
      alert("Specify a valid key.")
      return
    }
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
        className="m-2 grid space-x-2 rounded-lg p-5 shadow-lg dark:bg-slate-900 sm:grid-cols-2"
      >
        <div className="mb-5 sm:mb-0">
          <Tabs defaultValue="code">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="code">Code</TabsTrigger>
              <TabsTrigger value="preview">Preview</TabsTrigger>
            </TabsList>
            <TabsContent value="code" className="h-full w-full">
              <div style={{ fontFamily: "consolas" }}>
                <CodeBlock
                  {...{
                    text: md,
                    language: "markdown",
                    wrapLines: true,
                    showLineNumbers: false,
                    theme: sunburst,
                  }}
                />
              </div>
            </TabsContent>

            <TabsContent value="preview">
              <div>
                <MarkdownPreview
                  className="prose dark:prose-invert"
                  source={md}
                />
              </div>
            </TabsContent>
          </Tabs>
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
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-bold">Settings</h2>
          <h3 className="text-xl font-bold">Template</h3>
          <CodeEditor
            className="rounded-md border border-input"
            value={template}
            language="markdown"
            placeholder="Paste your markdown documentation template here."
            onChange={(evn) => setTemplate(evn.target.value)}
            padding={15}
            data-color-mode={theme == "light" ? "light" : "dark"}
            style={{
              fontFamily:
                "ui-monospace,SFMono-Regular,SF Mono,Consolas,Liberation Mono,Menlo,monospace",
            }}
          />
          <div className="flex items-center space-x-2">
            <h3 className="text-xl font-bold">Code Snippet</h3>
            <Select onValueChange={setLang}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select a language" />
              </SelectTrigger>
              <SelectContent className="max-h-[180px]">
                {languages.map((el) => {
                  return <SelectItem value={el}>{el}</SelectItem>
                })}
              </SelectContent>
            </Select>
          </div>
          <CodeEditor
            className="rounded-md border border-input"
            value={codeSn}
            language={lang}
            placeholder="Paste your code snippet here."
            onChange={(evn) => setCodeSn(evn.target.value)}
            padding={15}
            data-color-mode={theme == "light" ? "light" : "dark"}
            style={{
              fontFamily:
                "ui-monospace,SFMono-Regular,SF Mono,Consolas,Liberation Mono,Menlo,monospace",
            }}
          />

          <h3 className="text-xl font-bold">Model</h3>
          <div className="flex items-center space-x-2">
            <p>Key</p>
            <Input type="password" id="pwr" />
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
