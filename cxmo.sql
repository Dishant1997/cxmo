PGDMP     *    +                x            cxmo    12.4    12.4 T    �           0    0    ENCODING    ENCODING        SET client_encoding = 'UTF8';
                      false            �           0    0 
   STDSTRINGS 
   STDSTRINGS     (   SET standard_conforming_strings = 'on';
                      false            �           0    0 
   SEARCHPATH 
   SEARCHPATH     8   SELECT pg_catalog.set_config('search_path', '', false);
                      false            �           1262    49822    cxmo    DATABASE     �   CREATE DATABASE cxmo WITH TEMPLATE = template0 ENCODING = 'UTF8' LC_COLLATE = 'English_United States.1252' LC_CTYPE = 'English_United States.1252';
    DROP DATABASE cxmo;
                postgres    false            �            1259    49994    billing_histories    TABLE     '  CREATE TABLE public.billing_histories (
    billing_history_id integer NOT NULL,
    user_id integer,
    package_id integer,
    bill_amount_paid numeric,
    payament_ref_id text,
    payment_mode text,
    created_at timestamp without time zone,
    updated_at timestamp without time zone
);
 %   DROP TABLE public.billing_histories;
       public         heap    postgres    false            �            1259    49992 (   billing_histories_billing_history_id_seq    SEQUENCE     �   CREATE SEQUENCE public.billing_histories_billing_history_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 ?   DROP SEQUENCE public.billing_histories_billing_history_id_seq;
       public          postgres    false    222            �           0    0 (   billing_histories_billing_history_id_seq    SEQUENCE OWNED BY     u   ALTER SEQUENCE public.billing_histories_billing_history_id_seq OWNED BY public.billing_histories.billing_history_id;
          public          postgres    false    221            �            1259    49950 
   chat_files    TABLE     t   CREATE TABLE public.chat_files (
    chat_file_id integer NOT NULL,
    chat_id integer,
    chat_file_name text
);
    DROP TABLE public.chat_files;
       public         heap    postgres    false            �            1259    49948    chat_files_chat_file_id_seq    SEQUENCE     �   CREATE SEQUENCE public.chat_files_chat_file_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 2   DROP SEQUENCE public.chat_files_chat_file_id_seq;
       public          postgres    false    217            �           0    0    chat_files_chat_file_id_seq    SEQUENCE OWNED BY     [   ALTER SEQUENCE public.chat_files_chat_file_id_seq OWNED BY public.chat_files.chat_file_id;
          public          postgres    false    216            �            1259    49925    chats    TABLE     �   CREATE TABLE public.chats (
    chat_id integer NOT NULL,
    chat_message text,
    chat_send_by integer DEFAULT 0,
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now()
);
    DROP TABLE public.chats;
       public         heap    postgres    false            �            1259    49923    chats_chat_id_seq    SEQUENCE     �   CREATE SEQUENCE public.chats_chat_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 (   DROP SEQUENCE public.chats_chat_id_seq;
       public          postgres    false    215            �           0    0    chats_chat_id_seq    SEQUENCE OWNED BY     G   ALTER SEQUENCE public.chats_chat_id_seq OWNED BY public.chats.chat_id;
          public          postgres    false    214            �            1259    49836    configuration    TABLE     _   CREATE TABLE public.configuration (
    id integer NOT NULL,
    about_us character varying
);
 !   DROP TABLE public.configuration;
       public         heap    postgres    false            �            1259    49834    configuration_id_seq    SEQUENCE     �   CREATE SEQUENCE public.configuration_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 +   DROP SEQUENCE public.configuration_id_seq;
       public          postgres    false    205            �           0    0    configuration_id_seq    SEQUENCE OWNED BY     M   ALTER SEQUENCE public.configuration_id_seq OWNED BY public.configuration.id;
          public          postgres    false    204            �            1259    49900    membership_packages    TABLE     S  CREATE TABLE public.membership_packages (
    package_id integer NOT NULL,
    pack_name character varying,
    pack_price numeric DEFAULT 0,
    pack_description text,
    plan_type_id integer,
    pack_rewards integer,
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now()
);
 '   DROP TABLE public.membership_packages;
       public         heap    postgres    false            �            1259    49898 "   membership_packages_package_id_seq    SEQUENCE     �   CREATE SEQUENCE public.membership_packages_package_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 9   DROP SEQUENCE public.membership_packages_package_id_seq;
       public          postgres    false    211            �           0    0 "   membership_packages_package_id_seq    SEQUENCE OWNED BY     i   ALTER SEQUENCE public.membership_packages_package_id_seq OWNED BY public.membership_packages.package_id;
          public          postgres    false    210            �            1259    49889 
   plan_types    TABLE     g   CREATE TABLE public.plan_types (
    plan_type_id integer NOT NULL,
    type_name character varying
);
    DROP TABLE public.plan_types;
       public         heap    postgres    false            �            1259    49887    plan_types_plan_type_id_seq    SEQUENCE     �   CREATE SEQUENCE public.plan_types_plan_type_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 2   DROP SEQUENCE public.plan_types_plan_type_id_seq;
       public          postgres    false    209            �           0    0    plan_types_plan_type_id_seq    SEQUENCE OWNED BY     [   ALTER SEQUENCE public.plan_types_plan_type_id_seq OWNED BY public.plan_types.plan_type_id;
          public          postgres    false    208            �            1259    49825    roles    TABLE     ]   CREATE TABLE public.roles (
    role_id integer NOT NULL,
    role_name character varying
);
    DROP TABLE public.roles;
       public         heap    postgres    false            �            1259    49823    roles_role_id_seq    SEQUENCE     �   CREATE SEQUENCE public.roles_role_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 (   DROP SEQUENCE public.roles_role_id_seq;
       public          postgres    false    203            �           0    0    roles_role_id_seq    SEQUENCE OWNED BY     G   ALTER SEQUENCE public.roles_role_id_seq OWNED BY public.roles.role_id;
          public          postgres    false    202            �            1259    49914    user_package_history    TABLE     *  CREATE TABLE public.user_package_history (
    user_pack_id integer NOT NULL,
    user_id integer,
    package_id integer DEFAULT 0,
    purchase_date timestamp without time zone,
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now()
);
 (   DROP TABLE public.user_package_history;
       public         heap    postgres    false            �            1259    49912 %   user_package_history_user_pack_id_seq    SEQUENCE     �   CREATE SEQUENCE public.user_package_history_user_pack_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 <   DROP SEQUENCE public.user_package_history_user_pack_id_seq;
       public          postgres    false    213            �           0    0 %   user_package_history_user_pack_id_seq    SEQUENCE OWNED BY     o   ALTER SEQUENCE public.user_package_history_user_pack_id_seq OWNED BY public.user_package_history.user_pack_id;
          public          postgres    false    212            �            1259    49866    users    TABLE     �  CREATE TABLE public.users (
    user_id integer NOT NULL,
    role_id integer NOT NULL,
    first_name character varying,
    last_name character varying,
    username character varying,
    email character varying,
    mobile_number character varying,
    password text,
    status integer DEFAULT 0,
    profile_pic text,
    current_plan_id integer,
    wallet_address text,
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now()
);
    DROP TABLE public.users;
       public         heap    postgres    false            �            1259    49864    users_user_id_seq    SEQUENCE     �   CREATE SEQUENCE public.users_user_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 (   DROP SEQUENCE public.users_user_id_seq;
       public          postgres    false    207            �           0    0    users_user_id_seq    SEQUENCE OWNED BY     G   ALTER SEQUENCE public.users_user_id_seq OWNED BY public.users.user_id;
          public          postgres    false    206            �            1259    49964    video_categories    TABLE     l   CREATE TABLE public.video_categories (
    video_cat_id integer NOT NULL,
    cat_name character varying
);
 $   DROP TABLE public.video_categories;
       public         heap    postgres    false            �            1259    49976    videos    TABLE       CREATE TABLE public.videos (
    video_id integer NOT NULL,
    video_name character varying,
    video_file_name character varying,
    is_deleted integer DEFAULT 0,
    video_cat_id integer,
    created_at timestamp without time zone,
    updated_at timestamp without time zone
);
    DROP TABLE public.videos;
       public         heap    postgres    false            �            1259    49974    videos_video_id_seq    SEQUENCE     �   CREATE SEQUENCE public.videos_video_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 *   DROP SEQUENCE public.videos_video_id_seq;
       public          postgres    false    220            �           0    0    videos_video_id_seq    SEQUENCE OWNED BY     K   ALTER SEQUENCE public.videos_video_id_seq OWNED BY public.videos.video_id;
          public          postgres    false    219            �
           2604    49997 $   billing_histories billing_history_id    DEFAULT     �   ALTER TABLE ONLY public.billing_histories ALTER COLUMN billing_history_id SET DEFAULT nextval('public.billing_histories_billing_history_id_seq'::regclass);
 S   ALTER TABLE public.billing_histories ALTER COLUMN billing_history_id DROP DEFAULT;
       public          postgres    false    222    221    222            �
           2604    49953    chat_files chat_file_id    DEFAULT     �   ALTER TABLE ONLY public.chat_files ALTER COLUMN chat_file_id SET DEFAULT nextval('public.chat_files_chat_file_id_seq'::regclass);
 F   ALTER TABLE public.chat_files ALTER COLUMN chat_file_id DROP DEFAULT;
       public          postgres    false    217    216    217            �
           2604    49928    chats chat_id    DEFAULT     n   ALTER TABLE ONLY public.chats ALTER COLUMN chat_id SET DEFAULT nextval('public.chats_chat_id_seq'::regclass);
 <   ALTER TABLE public.chats ALTER COLUMN chat_id DROP DEFAULT;
       public          postgres    false    215    214    215            �
           2604    49839    configuration id    DEFAULT     t   ALTER TABLE ONLY public.configuration ALTER COLUMN id SET DEFAULT nextval('public.configuration_id_seq'::regclass);
 ?   ALTER TABLE public.configuration ALTER COLUMN id DROP DEFAULT;
       public          postgres    false    204    205    205            �
           2604    49903    membership_packages package_id    DEFAULT     �   ALTER TABLE ONLY public.membership_packages ALTER COLUMN package_id SET DEFAULT nextval('public.membership_packages_package_id_seq'::regclass);
 M   ALTER TABLE public.membership_packages ALTER COLUMN package_id DROP DEFAULT;
       public          postgres    false    210    211    211            �
           2604    49892    plan_types plan_type_id    DEFAULT     �   ALTER TABLE ONLY public.plan_types ALTER COLUMN plan_type_id SET DEFAULT nextval('public.plan_types_plan_type_id_seq'::regclass);
 F   ALTER TABLE public.plan_types ALTER COLUMN plan_type_id DROP DEFAULT;
       public          postgres    false    208    209    209            �
           2604    49828    roles role_id    DEFAULT     n   ALTER TABLE ONLY public.roles ALTER COLUMN role_id SET DEFAULT nextval('public.roles_role_id_seq'::regclass);
 <   ALTER TABLE public.roles ALTER COLUMN role_id DROP DEFAULT;
       public          postgres    false    202    203    203            �
           2604    49917 !   user_package_history user_pack_id    DEFAULT     �   ALTER TABLE ONLY public.user_package_history ALTER COLUMN user_pack_id SET DEFAULT nextval('public.user_package_history_user_pack_id_seq'::regclass);
 P   ALTER TABLE public.user_package_history ALTER COLUMN user_pack_id DROP DEFAULT;
       public          postgres    false    212    213    213            �
           2604    49869    users user_id    DEFAULT     n   ALTER TABLE ONLY public.users ALTER COLUMN user_id SET DEFAULT nextval('public.users_user_id_seq'::regclass);
 <   ALTER TABLE public.users ALTER COLUMN user_id DROP DEFAULT;
       public          postgres    false    206    207    207            �
           2604    49979    videos video_id    DEFAULT     r   ALTER TABLE ONLY public.videos ALTER COLUMN video_id SET DEFAULT nextval('public.videos_video_id_seq'::regclass);
 >   ALTER TABLE public.videos ALTER COLUMN video_id DROP DEFAULT;
       public          postgres    false    219    220    220            �          0    49994    billing_histories 
   TABLE DATA           �   COPY public.billing_histories (billing_history_id, user_id, package_id, bill_amount_paid, payament_ref_id, payment_mode, created_at, updated_at) FROM stdin;
    public          postgres    false    222   g       �          0    49950 
   chat_files 
   TABLE DATA           K   COPY public.chat_files (chat_file_id, chat_id, chat_file_name) FROM stdin;
    public          postgres    false    217   g       �          0    49925    chats 
   TABLE DATA           \   COPY public.chats (chat_id, chat_message, chat_send_by, created_at, updated_at) FROM stdin;
    public          postgres    false    215   ;g       z          0    49836    configuration 
   TABLE DATA           5   COPY public.configuration (id, about_us) FROM stdin;
    public          postgres    false    205   Xg       �          0    49900    membership_packages 
   TABLE DATA           �   COPY public.membership_packages (package_id, pack_name, pack_price, pack_description, plan_type_id, pack_rewards, created_at, updated_at) FROM stdin;
    public          postgres    false    211   ug       ~          0    49889 
   plan_types 
   TABLE DATA           =   COPY public.plan_types (plan_type_id, type_name) FROM stdin;
    public          postgres    false    209   �g       x          0    49825    roles 
   TABLE DATA           3   COPY public.roles (role_id, role_name) FROM stdin;
    public          postgres    false    203   �g       �          0    49914    user_package_history 
   TABLE DATA           x   COPY public.user_package_history (user_pack_id, user_id, package_id, purchase_date, created_at, updated_at) FROM stdin;
    public          postgres    false    213   �g       |          0    49866    users 
   TABLE DATA           �   COPY public.users (user_id, role_id, first_name, last_name, username, email, mobile_number, password, status, profile_pic, current_plan_id, wallet_address, created_at, updated_at) FROM stdin;
    public          postgres    false    207   �g       �          0    49964    video_categories 
   TABLE DATA           B   COPY public.video_categories (video_cat_id, cat_name) FROM stdin;
    public          postgres    false    218   h       �          0    49976    videos 
   TABLE DATA           y   COPY public.videos (video_id, video_name, video_file_name, is_deleted, video_cat_id, created_at, updated_at) FROM stdin;
    public          postgres    false    220   #h       �           0    0 (   billing_histories_billing_history_id_seq    SEQUENCE SET     W   SELECT pg_catalog.setval('public.billing_histories_billing_history_id_seq', 1, false);
          public          postgres    false    221            �           0    0    chat_files_chat_file_id_seq    SEQUENCE SET     J   SELECT pg_catalog.setval('public.chat_files_chat_file_id_seq', 1, false);
          public          postgres    false    216            �           0    0    chats_chat_id_seq    SEQUENCE SET     @   SELECT pg_catalog.setval('public.chats_chat_id_seq', 1, false);
          public          postgres    false    214            �           0    0    configuration_id_seq    SEQUENCE SET     C   SELECT pg_catalog.setval('public.configuration_id_seq', 1, false);
          public          postgres    false    204            �           0    0 "   membership_packages_package_id_seq    SEQUENCE SET     Q   SELECT pg_catalog.setval('public.membership_packages_package_id_seq', 1, false);
          public          postgres    false    210            �           0    0    plan_types_plan_type_id_seq    SEQUENCE SET     J   SELECT pg_catalog.setval('public.plan_types_plan_type_id_seq', 1, false);
          public          postgres    false    208            �           0    0    roles_role_id_seq    SEQUENCE SET     @   SELECT pg_catalog.setval('public.roles_role_id_seq', 1, false);
          public          postgres    false    202            �           0    0 %   user_package_history_user_pack_id_seq    SEQUENCE SET     T   SELECT pg_catalog.setval('public.user_package_history_user_pack_id_seq', 1, false);
          public          postgres    false    212            �           0    0    users_user_id_seq    SEQUENCE SET     @   SELECT pg_catalog.setval('public.users_user_id_seq', 1, false);
          public          postgres    false    206            �           0    0    videos_video_id_seq    SEQUENCE SET     B   SELECT pg_catalog.setval('public.videos_video_id_seq', 1, false);
          public          postgres    false    219            �
           2606    50002 (   billing_histories billing_histories_pkey 
   CONSTRAINT     v   ALTER TABLE ONLY public.billing_histories
    ADD CONSTRAINT billing_histories_pkey PRIMARY KEY (billing_history_id);
 R   ALTER TABLE ONLY public.billing_histories DROP CONSTRAINT billing_histories_pkey;
       public            postgres    false    222            �
           2606    49958    chat_files chat_files_pkey 
   CONSTRAINT     b   ALTER TABLE ONLY public.chat_files
    ADD CONSTRAINT chat_files_pkey PRIMARY KEY (chat_file_id);
 D   ALTER TABLE ONLY public.chat_files DROP CONSTRAINT chat_files_pkey;
       public            postgres    false    217            �
           2606    49936    chats chats_pkey 
   CONSTRAINT     S   ALTER TABLE ONLY public.chats
    ADD CONSTRAINT chats_pkey PRIMARY KEY (chat_id);
 :   ALTER TABLE ONLY public.chats DROP CONSTRAINT chats_pkey;
       public            postgres    false    215            �
           2606    49844     configuration configuration_pkey 
   CONSTRAINT     ^   ALTER TABLE ONLY public.configuration
    ADD CONSTRAINT configuration_pkey PRIMARY KEY (id);
 J   ALTER TABLE ONLY public.configuration DROP CONSTRAINT configuration_pkey;
       public            postgres    false    205            �
           2606    49911 ,   membership_packages membership_packages_pkey 
   CONSTRAINT     r   ALTER TABLE ONLY public.membership_packages
    ADD CONSTRAINT membership_packages_pkey PRIMARY KEY (package_id);
 V   ALTER TABLE ONLY public.membership_packages DROP CONSTRAINT membership_packages_pkey;
       public            postgres    false    211            �
           2606    49897    plan_types plan_types_pkey 
   CONSTRAINT     b   ALTER TABLE ONLY public.plan_types
    ADD CONSTRAINT plan_types_pkey PRIMARY KEY (plan_type_id);
 D   ALTER TABLE ONLY public.plan_types DROP CONSTRAINT plan_types_pkey;
       public            postgres    false    209            �
           2606    49833    roles roles_pkey 
   CONSTRAINT     S   ALTER TABLE ONLY public.roles
    ADD CONSTRAINT roles_pkey PRIMARY KEY (role_id);
 :   ALTER TABLE ONLY public.roles DROP CONSTRAINT roles_pkey;
       public            postgres    false    203            �
           2606    49922 .   user_package_history user_package_history_pkey 
   CONSTRAINT     v   ALTER TABLE ONLY public.user_package_history
    ADD CONSTRAINT user_package_history_pkey PRIMARY KEY (user_pack_id);
 X   ALTER TABLE ONLY public.user_package_history DROP CONSTRAINT user_package_history_pkey;
       public            postgres    false    213            �
           2606    49881    users users_email_key 
   CONSTRAINT     Q   ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key UNIQUE (email);
 ?   ALTER TABLE ONLY public.users DROP CONSTRAINT users_email_key;
       public            postgres    false    207            �
           2606    49877    users users_pkey 
   CONSTRAINT     S   ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (user_id);
 :   ALTER TABLE ONLY public.users DROP CONSTRAINT users_pkey;
       public            postgres    false    207            �
           2606    49879    users users_username_key 
   CONSTRAINT     W   ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_username_key UNIQUE (username);
 B   ALTER TABLE ONLY public.users DROP CONSTRAINT users_username_key;
       public            postgres    false    207            �
           2606    49971 &   video_categories video_categories_pkey 
   CONSTRAINT     n   ALTER TABLE ONLY public.video_categories
    ADD CONSTRAINT video_categories_pkey PRIMARY KEY (video_cat_id);
 P   ALTER TABLE ONLY public.video_categories DROP CONSTRAINT video_categories_pkey;
       public            postgres    false    218            �
           2606    49985    videos videos_pkey 
   CONSTRAINT     V   ALTER TABLE ONLY public.videos
    ADD CONSTRAINT videos_pkey PRIMARY KEY (video_id);
 <   ALTER TABLE ONLY public.videos DROP CONSTRAINT videos_pkey;
       public            postgres    false    220            �
           2606    50008 3   billing_histories billing_histories_package_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.billing_histories
    ADD CONSTRAINT billing_histories_package_id_fkey FOREIGN KEY (package_id) REFERENCES public.membership_packages(package_id) ON UPDATE CASCADE ON DELETE CASCADE;
 ]   ALTER TABLE ONLY public.billing_histories DROP CONSTRAINT billing_histories_package_id_fkey;
       public          postgres    false    222    211    2791            �
           2606    50003 0   billing_histories billing_histories_user_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.billing_histories
    ADD CONSTRAINT billing_histories_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(user_id) ON UPDATE CASCADE ON DELETE CASCADE;
 Z   ALTER TABLE ONLY public.billing_histories DROP CONSTRAINT billing_histories_user_id_fkey;
       public          postgres    false    207    2785    222            �
           2606    49959 "   chat_files chat_files_chat_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.chat_files
    ADD CONSTRAINT chat_files_chat_id_fkey FOREIGN KEY (chat_id) REFERENCES public.chats(chat_id) ON UPDATE CASCADE ON DELETE CASCADE;
 L   ALTER TABLE ONLY public.chat_files DROP CONSTRAINT chat_files_chat_id_fkey;
       public          postgres    false    215    2795    217            �
           2606    49882    users users_role_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_role_id_fkey FOREIGN KEY (role_id) REFERENCES public.roles(role_id) ON UPDATE CASCADE ON DELETE CASCADE;
 B   ALTER TABLE ONLY public.users DROP CONSTRAINT users_role_id_fkey;
       public          postgres    false    2779    207    203            �
           2606    49986    videos videos_video_cat_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.videos
    ADD CONSTRAINT videos_video_cat_id_fkey FOREIGN KEY (video_cat_id) REFERENCES public.video_categories(video_cat_id) ON UPDATE CASCADE ON DELETE CASCADE;
 I   ALTER TABLE ONLY public.videos DROP CONSTRAINT videos_video_cat_id_fkey;
       public          postgres    false    218    220    2799            �      x������ � �      �      x������ � �      �      x������ � �      z      x������ � �      �      x������ � �      ~      x������ � �      x      x������ � �      �      x������ � �      |      x������ � �      �      x������ � �      �      x������ � �     