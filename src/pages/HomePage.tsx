import AskInput from "@/components/ai/chat/AskInput";
import { Container } from "@mantine/core";
import React from "react";

export default function HomePage(): React.ReactElement {
  return (
    <Container className="relative home-page w-full p-6" size="xl">
      <div className="grid grid-col-12 gap-4 h-[calc(100vh-120px)]">
        
      </div>

      <div className="pb-6 max-w-[85%] mx-auto">
        <AskInput />
      </div>
    </Container>
  )
}