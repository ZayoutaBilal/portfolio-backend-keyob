import React from "react";

interface ContactEmailProps {
    name: string;
    email: string;
    subject: string;
    message: string;
}

export default function ContactEmailTemplate({
                                                 name,
                                                 email,
                                                 subject,
                                                 message,
                                             }: ContactEmailProps) {
    return (
        <div
            style={{
                fontFamily: "Arial, sans-serif",
                backgroundColor: "#f4f4f4",
                padding: "20px",
            }}
        >
            <table
                style={{
                    maxWidth: "600px",
                    margin: "auto",
                    backgroundColor: "#ffffff",
                    borderCollapse: "collapse",
                    borderRadius: "8px",
                    overflow: "hidden",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                }}
            >
                <thead style={{ backgroundColor: "#1a73e8", color: "#ffffff", textAlign: "left" }}>
                <tr>
                    <th colSpan={2} style={{ padding: "15px", fontSize: "20px" }}>
                        📩 New Contact Message
                    </th>
                </tr>
                </thead>
                <tbody>
                <tr>
                    <td style={{ padding: "12px", fontWeight: "bold", width: "30%" }}>
                        Name
                    </td>
                    <td style={{ padding: "12px" }}>{name}</td>
                </tr>
                <tr style={{ backgroundColor: "#f9f9f9" }}>
                    <td style={{ padding: "12px", fontWeight: "bold" }}>Email</td>
                    <td style={{ padding: "12px" }}>
                        <a href={`mailto:${email}`} style={{ color: "#1a73e8" }}>
                            {email}
                        </a>
                    </td>
                </tr>
                <tr>
                    <td style={{ padding: "12px", fontWeight: "bold" }}>Subject</td>
                    <td style={{ padding: "12px" }}>{subject}</td>
                </tr>
                <tr style={{ backgroundColor: "#f9f9f9" }}>
                    <td style={{ padding: "12px", fontWeight: "bold" }}>Message</td>
                    <td style={{ padding: "12px" }}>
                        {message.split("\n").map((line, i) => (
                            <div key={i}>{line}</div>
                        ))}
                    </td>
                </tr>
                </tbody>
                <tfoot
                    style={{
                        backgroundColor: "#f4f4f4",
                        textAlign: "center",
                        fontSize: "12px",
                        color: "#666",
                    }}
                >
                <tr>
                    <td colSpan={2} style={{ padding: "10px" }}>
                        Sent from your portfolio contact form
                    </td>
                </tr>
                </tfoot>
            </table>
        </div>
    );
}
