import * as React from "react";
import { Html, Body, Container, Heading, Text, Section } from "@react-email/components";

interface ContactEmailProps {
    name: string;
    email: string;
    projectType: string;
    company: string;
    budget: string;
    message: string;
}

export const DevLanceContactEmailTemplate = ({ name, email, projectType, company , budget, message }: ContactEmailProps) => {
    return (
        <Html>
            <Body style={{ backgroundColor: "#f5f6fa", fontFamily: "Arial, sans-serif" }}>
                <Container style={{ maxWidth: "600px", margin: "auto", borderRadius: "12px", overflow: "hidden", boxShadow: "0 4px 16px rgba(0,0,0,0.08)" }}>

                    {/* Header */}
                    <Section style={{ backgroundColor: "#1928a5", padding: "20px", textAlign: "center" }}>
                        <Heading style={{ color: "#ffffff", fontSize: "22px" }}>📬 New Contact Message</Heading>
                    </Section>

                    {/* Body */}
                    <Section style={{ padding: "24px", color: "#333", lineHeight: "1.6" }}>
                        <Text><strong>Name:</strong> {name}</Text>
                        <Text>
                            <strong>Email:</strong>{" "}
                            <a href={`mailto:${email}`} style={{ color: "#263bf2" }}>{email}</a>
                        </Text>
                        <Text><strong>Company:</strong> {company}</Text>
                        <Text><strong>Project Type:</strong> {projectType}</Text>
                        <Text><strong>Budget:</strong> {budget}</Text>
                        <Text>
                            <strong>Message:</strong><br />
                            {message.split("\n").map((line, i) => (
                                <span key={i}>
                  {line}<br />
                </span>
                            ))}
                        </Text>
                    </Section>

                    {/* Footer */}
                    <Section style={{ backgroundColor: "#f0f0f0", textAlign: "center", fontSize: "13px", color: "#666", padding: "12px" }}>
                        Sent from DevLance website contact form
                    </Section>

                </Container>
            </Body>
        </Html>
    );
};

export default DevLanceContactEmailTemplate;
