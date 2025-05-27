import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("reports", {name: "Report"})
export class Report {
    @PrimaryGeneratedColumn()
    id: number

    @Column("text")
    reportName: string

    @Column("text", {default: "general"})
    reportType: string

    @Column("date")
    dateGenerated: Date

    @Column("text")
    filePath: string
}