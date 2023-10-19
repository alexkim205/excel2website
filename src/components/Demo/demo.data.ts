import {DashboardType} from "../../utils/types";

export const demoData = {
    dashboard: {
        id: "390cae7b-4114-44d6-92aa-4397e9b9fe47",
        created_at: "2023-10-02T08:17:19.321649+00:00",
        user: "5aadc53d-cc8f-4273-a039-31d558df19f0",
        data: {
            id: "390cae7b-4114-44d6-92aa-4397e9b9fe47",
            title: "Revenue Dashboard",
            description: "A public dashboard for excel spreadsheet: https://onedrive.live.com/.....\n"
        },
        subdomain: "demo",
        custom_domain: ""
    } as DashboardType,
    charts: [
        {
            id: "4eabaa44-102b-4fd2-9101-7c8620c69203",
            created_at: "2023-10-02T08:17:56.441095+00:00",
            user: "5aadc53d-cc8f-4273-a039-31d558df19f0",
            data: {
                id: "4eabaa44-102b-4fd2-9101-7c8620c69203",
                type: "basic_scatter",
                srcUrl: "https://onedrive.live.com/edit.aspx?resid=demo",
                dataRange: "'Sheet1'!A1:D17",
                coordinates: {
                    sm: {
                        x: 0,
                        y: 9,
                        w: 6,
                        h: 3,
                        i: "4eabaa44-102b-4fd2-9101-7c8620c69203"
                    },
                    md: {
                        x: 0,
                        y: 9,
                        w: 10,
                        h: 3,
                        i: "4eabaa44-102b-4fd2-9101-7c8620c69203"
                    },
                    lg: {
                        x: 5,
                        y: 3,
                        w: 7,
                        h: 3,
                        i: "4eabaa44-102b-4fd2-9101-7c8620c69203"
                    }
                },
                chart: {
                    title: {
                        text: "Retention",
                        subtext: "Weekly retention of users",
                        textStyle: {
                            fontSize: 24
                        },
                        subtextStyle: {
                            fontSize: 16
                        }
                    },
                    legend: {
                        show: false
                    },
                    xAxis: {
                        name: "Time",
                        type: null
                    },
                    yAxis: {
                        name: "Count",
                        type: null
                    }
                },
                srcProvider: "azure"
            },
            dashboard: "390cae7b-4114-44d6-92aa-4397e9b9fe47"
        },
        {
            id: "66680ebf-2295-422a-8e30-d14fce7391cd",
            created_at: "2023-10-03T16:58:45.273043+00:00",
            user: "5aadc53d-cc8f-4273-a039-31d558df19f0",
            data: {
                id: "66680ebf-2295-422a-8e30-d14fce7391cd",
                type: "area_line",
                srcUrl: "https://onedrive.live.com/edit.aspx?resid=demo",
                dataRange: "'Sheet1'!A1:B17",
                coordinates: {
                    sm: {
                        x: 0,
                        y: 6,
                        w: 6,
                        h: 3,
                        i: "66680ebf-2295-422a-8e30-d14fce7391cd"
                    },
                    md: {
                        x: 4,
                        y: 6,
                        w: 6,
                        h: 3,
                        i: "66680ebf-2295-422a-8e30-d14fce7391cd"
                    },
                    lg: {
                        x: 0,
                        y: 6,
                        w: 7,
                        h: 3,
                        i: "66680ebf-2295-422a-8e30-d14fce7391cd"
                    }
                },
                chart: {
                    title: {
                        text: "Cumulative users visiting pricing page",
                        subtext: "",
                        textStyle: {
                            fontSize: 24
                        },
                        subtextStyle: {
                            fontSize: 16
                        }
                    },
                    legend: {
                        show: true
                    },
                    xAxis: {
                        name: "Time",
                        type: null
                    },
                    yAxis: {
                        name: "Number of packages",
                        type: null
                    }
                },
                srcProvider: "azure"
            },
            dashboard: "390cae7b-4114-44d6-92aa-4397e9b9fe47"
        },
        {
            id: "842296de-3934-4968-9e66-63532fb7d286",
            created_at: "2023-10-03T19:39:27.083614+00:00",
            user: "5aadc53d-cc8f-4273-a039-31d558df19f0",
            data: {
                id: "842296de-3934-4968-9e66-63532fb7d286",
                type: "basic_bar",
                srcUrl: "https://onedrive.live.com/edit.aspx?resid=demo",
                dataRange: "'Sheet1'!A1:D17",
                coordinates: {
                    sm: {
                        x: 3,
                        y: 0,
                        w: 3,
                        h: 3,
                        i: "842296de-3934-4968-9e66-63532fb7d286"
                    },
                    md: {
                        x: 0,
                        y: 3,
                        w: 4,
                        h: 3,
                        i: "842296de-3934-4968-9e66-63532fb7d286"
                    },
                    lg: {
                        x: 0,
                        y: 0,
                        w: 5,
                        h: 3,
                        i: "842296de-3934-4968-9e66-63532fb7d286"
                    }
                },
                chart: {
                    title: {
                        text: "",
                        subtext: "",
                        textStyle: {
                            fontSize: 24
                        },
                        subtextStyle: {
                            fontSize: 16
                        }
                    },
                    legend: {
                        show: true
                    },
                    xAxis: {
                        name: "",
                        type: null
                    },
                    yAxis: {
                        name: "",
                        type: null
                    }
                },
                srcProvider: "azure"
            },
            dashboard: "390cae7b-4114-44d6-92aa-4397e9b9fe47"
        },
        {
            id: "e52dd612-a347-4abe-9337-a6a7434c32fe",
            created_at: "2023-10-02T08:18:51.364443+00:00",
            user: "5aadc53d-cc8f-4273-a039-31d558df19f0",
            data: {
                id: "e52dd612-a347-4abe-9337-a6a7434c32fe",
                type: "basic_pie",
                srcUrl: "https://onedrive.live.com/edit.aspx?resid=demo",
                dataRange: "'Sheet1'!A1:D17",
                coordinates: {
                    sm: {
                        x: 3,
                        y: 3,
                        w: 3,
                        h: 3,
                        i: "e52dd612-a347-4abe-9337-a6a7434c32fe"
                    },
                    md: {
                        x: 4,
                        y: 3,
                        w: 6,
                        h: 3,
                        i: "e52dd612-a347-4abe-9337-a6a7434c32fe"
                    },
                    lg: {
                        x: 7,
                        y: 6,
                        w: 5,
                        h: 3,
                        i: "e52dd612-a347-4abe-9337-a6a7434c32fe"
                    }
                },
                chart: {
                    title: {
                        text: "Visitors by Country",
                        subtext: "",
                        textStyle: {
                            fontSize: 24
                        },
                        subtextStyle: {
                            fontSize: 16
                        }
                    },
                    legend: {
                        show: true
                    },
                    xAxis: {
                        name: "",
                        type: null
                    },
                    yAxis: {
                        name: "",
                        type: null
                    }
                },
                srcProvider: "azure"
            },
            dashboard: "390cae7b-4114-44d6-92aa-4397e9b9fe47"
        },
        {
            id: "9b1a2d8b-a910-45dc-912c-1db0effeecb0",
            created_at: "2023-10-03T16:57:39.675598+00:00",
            user: "5aadc53d-cc8f-4273-a039-31d558df19f0",
            data: {
                id: "9b1a2d8b-a910-45dc-912c-1db0effeecb0",
                type: "ring_pie",
                srcUrl: "https://onedrive.live.com/edit.aspx?resid=demo",
                dataRange: "'Sheet1'!A1:D17",
                coordinates: {
                    sm: {
                        x: 0,
                        y: 0,
                        w: 3,
                        h: 3,
                        i: "9b1a2d8b-a910-45dc-912c-1db0effeecb0"
                    },
                    md: {
                        x: 0,
                        y: 0,
                        w: 3,
                        h: 3,
                        i: "9b1a2d8b-a910-45dc-912c-1db0effeecb0"
                    },
                    lg: {
                        x: 9,
                        y: 0,
                        w: 3,
                        h: 3,
                        i: "9b1a2d8b-a910-45dc-912c-1db0effeecb0"
                    }
                },
                chart: {
                    title: {
                        text: "",
                        subtext: "",
                        textStyle: {
                            fontSize: 24
                        },
                        subtextStyle: {
                            fontSize: 16
                        }
                    },
                    legend: {
                        show: false
                    },
                    xAxis: {
                        name: "",
                        type: null
                    },
                    yAxis: {
                        name: "",
                        type: null
                    }
                },
                srcProvider: "azure"
            },
            dashboard: "390cae7b-4114-44d6-92aa-4397e9b9fe47"
        },
        {
            id: "40909148-1e13-49ad-8753-3d5485499598",
            created_at: "2023-10-02T08:37:10.473375+00:00",
            user: "5aadc53d-cc8f-4273-a039-31d558df19f0",
            data: {
                id: "40909148-1e13-49ad-8753-3d5485499598",
                type: "basic_line",
                srcUrl: "https://onedrive.live.com/edit.aspx?resid=demo",
                dataRange: "'Sheet1'!A1:D17",
                coordinates: {
                    sm: {
                        x: 0,
                        y: 12,
                        w: 6,
                        h: 3,
                        i: "40909148-1e13-49ad-8753-3d5485499598"
                    },
                    md: {
                        x: 3,
                        y: 0,
                        w: 7,
                        h: 3,
                        i: "40909148-1e13-49ad-8753-3d5485499598"
                    },
                    lg: {
                        x: 0,
                        y: 3,
                        w: 5,
                        h: 3,
                        i: "40909148-1e13-49ad-8753-3d5485499598"
                    }
                },
                chart: {
                    title: {
                        text: "Weekly active users",
                        subtext: "Shows the number of unique users that use your app every week.",
                        textStyle: {
                            fontSize: 24
                        },
                        subtextStyle: {
                            fontSize: 16
                        }
                    },
                    legend: {
                        show: false
                    },
                    xAxis: {
                        name: "Weeks",
                        type: null
                    },
                    yAxis: {
                        name: "Users",
                        type: null
                    }
                },
                srcProvider: "azure"
            },
            dashboard: "390cae7b-4114-44d6-92aa-4397e9b9fe47"
        },
        {
            id: "086031fe-170f-418e-9dc5-f2402d0acb88",
            created_at: "2023-10-02T08:18:24.2414+00:00",
            user: "5aadc53d-cc8f-4273-a039-31d558df19f0",
            data: {
                id: "086031fe-170f-418e-9dc5-f2402d0acb88",
                type: "basic_bar",
                srcUrl: "https://onedrive.live.com/edit.aspx?resid=demo",
                dataRange: "'Sheet1'!A1:D17",
                coordinates: {
                    sm: {
                        x: 0,
                        y: 3,
                        w: 3,
                        h: 3,
                        i: "086031fe-170f-418e-9dc5-f2402d0acb88"
                    },
                    md: {
                        x: 0,
                        y: 6,
                        w: 4,
                        h: 3,
                        i: "086031fe-170f-418e-9dc5-f2402d0acb88"
                    },
                    lg: {
                        x: 5,
                        y: 0,
                        w: 4,
                        h: 3,
                        i: "086031fe-170f-418e-9dc5-f2402d0acb88"
                    }
                },
                chart: {
                    title: {
                        text: "Referring domain",
                        subtext: "Shows the most common referring domains.",
                        textStyle: {
                            fontSize: 24
                        },
                        subtextStyle: {
                            fontSize: 16
                        }
                    },
                    legend: {
                        show: false
                    },
                    xAxis: {
                        name: "Domain",
                        type: null
                    },
                    yAxis: {
                        name: "Count",
                        type: null
                    }
                },
                srcProvider: "azure"
            },
            dashboard: "390cae7b-4114-44d6-92aa-4397e9b9fe47"
        }
    ],
    user: {
        provider_token: "xxx",
        provider_refresh_token: "xxx",
        access_token: "xxx",
        expires_in: 3600,
        expires_at: 1697750247,
        refresh_token: "xxx",
        token_type: "bearer",
        user: {
            id: "b2e2b141-c1a2-45fa-aa0d-13207bb893e3",
            aud: "authenticated",
            role: "authenticated",
            email: "test@gmail.com",
            email_confirmed_at: "2023-10-13T01:43:29.0272Z",
            phone: "",
            confirmed_at: "2023-10-13T01:43:29.0272Z",
            recovery_sent_at: "2023-10-16T02:56:49.128121Z",
            last_sign_in_at: "2023-10-19T20:17:26.218963Z",
            app_metadata: {
                provider: "azure",
                providers: [
                    "azure"
                ]
            },
            user_metadata: {
                avatar_url: "xxx",
                email: "demo@gmail.com",
                email_verified: true,
                full_name: "John Doe",
                azure: {
                    provider_refresh_token: "xxx",
                    provider_token: "xxx"
                },
                google: {
                    provider_refresh_token: "xxx",
                    provider_token: "xxx"
                },
                iss: "https://www.googleapis.com/userinfo/v2/me",
                name: "John Doe",
                picture: "xxx",
                plan: "life",
                provider_id: "104729193293050713918",
                sub: "104729193293050713918"
            },
            identities: [
                {
                    id: "104729193293050713918",
                    user_id: "b2e2b141-c1a2-45fa-aa0d-13207bb893e3",
                    identity_data: {
                        avatar_url: "xxx",
                        email: "test@gmail.com",
                        email_verified: true,
                        full_name: "John Doe",
                        iss: "https://www.googleapis.com/userinfo/v2/me",
                        name: "John Doe",
                        picture: "xxx",
                        provider_id: "104729193293050713918",
                        sub: "104729193293050713918"
                    },
                    provider: "azure",
                    last_sign_in_at: "2023-10-13T01:43:29.024837Z",
                    created_at: "2023-10-13T01:43:29.024851Z",
                    updated_at: "2023-10-19T20:17:26.216409Z"
                }
            ],
            created_at: "2023-10-13T01:43:29.01987Z",
            updated_at: "2023-10-19T20:17:26.900695Z"
        }
    },
    values: [
        [
            "value",
            "a",
            "b",
            "c"
        ],
        [
            2,
            1,
            2,
            4
        ],
        [
            3,
            2,
            4,
            8
        ],
        [
            4,
            3,
            6,
            12
        ],
        [
            5,
            4,
            8,
            16
        ],
        [
            6,
            5,
            10,
            20
        ],
        [
            7,
            6,
            12,
            24
        ],
        [
            8,
            7,
            14,
            28
        ],
        [
            9,
            8,
            16,
            32
        ],
        [
            10,
            9,
            18,
            36
        ],
        [
            "",
            "",
            "",
            ""
        ],
        [
            "",
            "",
            "",
            ""
        ],
        [
            "",
            "",
            "",
            ""
        ],
        [
            "",
            "",
            "",
            ""
        ],
        [
            "",
            "",
            "",
            ""
        ],
        [
            "",
            "",
            "",
            ""
        ],
        [
            "",
            "",
            "",
            ""
        ]
    ]
}