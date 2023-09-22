create table "public"."dashboard_items" (
    "id" uuid not null default uuid_generate_v4(),
    "created_at" timestamp with time zone default now(),
    "user" uuid,
    "data" json not null default '{}'::json,
    "dashboard" uuid
);


alter table "public"."dashboard_items" enable row level security;

create table "public"."dashboards" (
    "id" uuid not null default uuid_generate_v4(),
    "created_at" timestamp with time zone default now(),
    "user" uuid not null,
    "data" json not null default '{}'::json
);


alter table "public"."dashboards" enable row level security;

CREATE UNIQUE INDEX dashboard_items_pkey ON public.dashboard_items USING btree (id);

CREATE UNIQUE INDEX dashboards_pkey ON public.dashboards USING btree (id);

alter table "public"."dashboard_items" add constraint "dashboard_items_pkey" PRIMARY KEY using index "dashboard_items_pkey";

alter table "public"."dashboards" add constraint "dashboards_pkey" PRIMARY KEY using index "dashboards_pkey";

alter table "public"."dashboard_items" add constraint "dashboard_items_dashboard_fkey" FOREIGN KEY (dashboard) REFERENCES dashboards(id) not valid;

alter table "public"."dashboard_items" validate constraint "dashboard_items_dashboard_fkey";

alter table "public"."dashboard_items" add constraint "dashboard_items_user_fkey" FOREIGN KEY ("user") REFERENCES auth.users(id) not valid;

alter table "public"."dashboard_items" validate constraint "dashboard_items_user_fkey";

alter table "public"."dashboards" add constraint "dashboards_user_fkey" FOREIGN KEY ("user") REFERENCES auth.users(id) not valid;

alter table "public"."dashboards" validate constraint "dashboards_user_fkey";


