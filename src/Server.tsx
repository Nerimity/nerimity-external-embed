import { useSearchParams } from "@solidjs/router";
import style from "./Server.module.css";
import { createResource, For, Show } from "solid-js";

interface Server {
  avatar: "avatars/1289157729608441856/1354033615071256576.webp";
  banner: string;
  hexColor: string;
  verified: true;
  name: string;
}

interface OnlineUser {
  avatar: string;
  banner: string;
  username: string;
  hexColor: string;
  id: 0;
  presence: {
    custom: string;
    status: 2;
    activity: null;
  };
}

interface ExternalEmbed {
  id: string;
  serverInviteCode: string;
  server: Server;
  onlineMembersCount: number;
  onlineUsers: OnlineUser[];
}

const fetchServer = async (id: string) => {
  const res = await fetch(
    `https://nerimity.com/api/servers/${id}/external-embed.json`
  );
  return res.json() as unknown as ExternalEmbed;
};

function Server() {
  const [params] = useSearchParams<{ id?: string }>();
  const [embed] = createResource(() => params.id, fetchServer);

  return (
    <Show when={embed()} fallback={<div>Loading...</div>}>
      <Header server={embed()!.server} />
      <MemberList embed={embed()!} />
      <Footer embed={embed()!} />
    </Show>
  );
}

const MemberList = (props: { embed: ExternalEmbed }) => {
  return (
    <div class={style.memberList}>
      <For each={props.embed.onlineUsers}>
        {(member) => <MemberItem member={member} />}
      </For>
    </div>
  );
};

const MemberItem = (props: { member: OnlineUser }) => {
  return (
    <div class={style.memberItem}>
      <div class={style.memberInfo}>
        <Avatar
          hash={props.member.avatar}
          bgColor={props.member.hexColor}
          size={20}
        />
        <div class={style.memberName}>{props.member.username}</div>
      </div>
    </div>
  );
};

const hashToCdnLink = (hash: string, size: number = 20) => {
  return `https://cdn.nerimity.com/external-embed/${hash}?size=${size}&type=webp`;
};
const pathToCdnLink = (path?: string, size: number = 20) => {
  if (!path) return undefined;
  return `https://cdn.nerimity.com/${path}?size=${size}&type=webp`;
};

const Avatar = (props: {
  hash?: string;
  path?: string;
  bgColor?: string;
  size: number;
}) => {
  return (
    <div
      class={style.avatarContainer}
      style={{
        "background-color":
          !props.hash && !props.path ? props.bgColor : undefined,
        width: `${props.size}px`,
        height: `${props.size}px`,
      }}
    >
      <Show when={props.hash || props.path}>
        <img
          class={style.avatar}
          src={
            pathToCdnLink(props.path, props.size) ||
            hashToCdnLink(props.hash!, props.size)
          }
        />
      </Show>
    </div>
  );
};

const Header = (props: { server: Server }) => {
  return (
    <a
      class={style.header}
      target="_blank"
      rel="noopener noreferrer"
      href="https://nerimity.com"
    >
      <Avatar
        path={props.server.avatar}
        bgColor={props.server.hexColor}
        size={35}
      />
      <div>
        <div class={style.appName}>Nerimity</div>
        <div class={style.slogan}>A modern and sleek chat app.</div>
      </div>
    </a>
  );
};
const Footer = (props: { embed: ExternalEmbed }) => {
  const server = () => props.embed.server;
  return (
    <div class={style.footer}>
      <Avatar path={server().avatar} bgColor={server().hexColor} size={35} />
      <div class={style.serverInfo}>
        <div class={style.serverName}>{server().name}</div>
        <div class={style.memberCount}>
          {props.embed.onlineMembersCount} Online
        </div>
      </div>
      <a
        target="_blank"
        rel="noopener noreferrer"
        class={style.joinButton}
        href={`https://nerimity.com/i/${props.embed.serverInviteCode}`}
      >
        Join Server
      </a>
    </div>
  );
};

export default Server;
