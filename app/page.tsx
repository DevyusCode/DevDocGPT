"use client"

import React, { useState } from "react"
import Link from "next/link"
import { Configuration, OpenAIApi } from "openai"

import { siteConfig } from "@/config/site"
import { Button, buttonVariants } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"

export default function IndexPage() {
  let model = "gpt-3.5-turbo"
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
      let res = completion.data.choices[0].message.content
      let text = document.getElementById("codetxt") as HTMLTextAreaElement
      text.value = res
    } catch (error) {
      alert("An error occured:\n" + error)
    }
  }

  function onModelChange(v) {
    model = v
  }

  return (
    <div className="container">
      <section className="flex flex-col items-center min-h-screen justify-center">
        <h1 className="text-5xl font-bold ">
          Create documentation easily with AI.
        </h1>
        <p className="text-slate-500">
          Document your products using OpenAI's GPT-4 models.
        </p>
      </section>
      <section className="grid grid-cols-2 p-5 m-2 rounded-lg shadow-lg dark:bg-slate-900 space-x-2">
        <div>
          <Tabs defaultValue="code">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="code">Code</TabsTrigger>
              <TabsTrigger value="preview">Preview</TabsTrigger>
            </TabsList>
            <TabsContent value="code" className="w-full h-full">
              <Textarea
                id="codetxt"
                placeholder="Code will be shown here"
                className=""
              />
            </TabsContent>

            <TabsContent value="preview">Soon.</TabsContent>
          </Tabs>
        </div>
        <div className="space-y-2">
          <h2 className="font-bold text-2xl">Settings</h2>
          <h3 className="font-bold text-xl">Template</h3>
          <Textarea
            id="templatetxt"
            placeholder="Paste your markdown documentation template here."
          />
          <h3 className="font-bold text-xl">Code Snippet</h3>
          <Textarea
            id="codesnippet"
            placeholder="Paste your code snippet here."
          />
          <h3 className="font-bold text-xl">Model</h3>
          <div className="flex space-x-2 items-center">
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
          <div className="flex justify-center m-4">
            <Button onClick={getDoc}>Generate</Button>
          </div>
        </div>
      </section>
    </div>
  )
}
