CREATE TABLE "activityHiscores" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "activityHiscores_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"hiscoresId" integer NOT NULL,
	"activityId" integer NOT NULL,
	"name" varchar(255) NOT NULL,
	"rank" integer NOT NULL,
	"score" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE "hiscores" (
	"id" integer GENERATED ALWAYS AS IDENTITY (sequence name "hiscores_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"rsn" varchar(255) NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "hiscores_id_created_at_pk" PRIMARY KEY("id","created_at")
);
--> statement-breakpoint
CREATE TABLE "skillHiscores" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "skillHiscores_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"hiscoresId" integer NOT NULL,
	"skillId" integer NOT NULL,
	"name" varchar(255) NOT NULL,
	"rank" integer NOT NULL,
	"level" integer NOT NULL,
	"xp" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "users_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"name" varchar(255) NOT NULL,
	"password" varchar(255) NOT NULL,
	CONSTRAINT "users_name_unique" UNIQUE("name")
);
--> statement-breakpoint
ALTER TABLE "activityHiscores" ADD CONSTRAINT "activityHiscores_hiscoresId_hiscores_id_fk" FOREIGN KEY ("hiscoresId") REFERENCES "public"."hiscores"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "skillHiscores" ADD CONSTRAINT "skillHiscores_hiscoresId_hiscores_id_fk" FOREIGN KEY ("hiscoresId") REFERENCES "public"."hiscores"("id") ON DELETE no action ON UPDATE no action;