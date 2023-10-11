import {Card, CardBody} from "@nextui-org/react";
import {Section} from "./Section";
import ExampleDataInputImage from "../../assets/example_data_input.png?w=600;1200;1600;&position=top&format=webp&as=source&imagetools"
import ExampleChart from "../../assets/example_chart.png?w=600;1200;1600;&position=top&format=webp&as=source&imagetools"
import ExampleDashboard from "../../assets/example_dashboard.png?w=600;1200;1600;&position=top&format=webp&as=source&imagetools"
import {ResponsiveImage} from "../ResponsiveImage";

function Feature({title, subtitle, imgSrcSet}: {title: string,subtitle: string, imgSrcSet: {src: string, w: number}[]}) {
    return (
        <div className="grid grid-cols-8 gap-8 w-full">
            <div className="sm:text-left text-center col-span-full sm:col-span-3">
                <h3 className="font-semibold sm:text-2xl text-xl mb-2">{title}</h3>
                <p>{subtitle}</p>
            </div>
            <div className="col-span-full sm:col-span-5 relative sm:h-[530px]">
                <Card fullWidth shadow="md" className="block sm:absolute w-[900px] border-none"
                      classNames={{body: "p-0"}}>
                    <CardBody>
                        <ResponsiveImage srcSet={imgSrcSet} alt="Example data input image"/>
                    </CardBody>
                </Card>
            </div>
        </div>
    )
}

const FEATURES = [
    {
        title: "Add a data source",
        subtitle: "Copy and paste the Microsoft Excel/Google Sheets workbook URL and define the data range to use for the chart. Or if you prefer, copy and paste the raw data!",
        imgSrcSet: ExampleDataInputImage
    },
    {
        title: "Customize how your charts look and feel",
        subtitle: "Choose from a variety of different graph types, add titles and descriptions. Keep an eye out for more customization options!",
        imgSrcSet: ExampleChart
    },
    {
        title: "... and hit publish! 🥂",
        subtitle: "Congrats, you've just created your first public dashboard. You can also bring your own domain so that you can maintain your brand and make dashboards easier to share.",
        imgSrcSet: ExampleDashboard
    }
]

export function Features() {
    return (
        <Section
            title={
                <>
                    Finally, <span className="underline underline-offset-4">a pain-free simple way</span> to create
                    dashboards.
                </>
            }
        >
            <div className="flex flex-col gap-8">
                {FEATURES.map(({title, subtitle, imgSrcSet}) => (
                    <Feature key={title} title={title} subtitle={subtitle} imgSrcSet={imgSrcSet}/>
                ))}
            </div>
        </Section>
    )
}