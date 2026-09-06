import { Box, Button, Link, Paper, Typography } from "@mui/material";
import { useEffect, useRef, useState, type ReactElement } from "react";
import { insertToken } from "../../store/token";
import { useAppDispatch } from "../../store/hooks";

const BRIGHTSPACE_ORIGIN = "https://brightspace.algonquincollege.com";

interface AuthMessage {
  type: "brightspace-auth-token";
  accessToken: string;
}

const isAuthMessage = (data: unknown): data is AuthMessage => {
  if (typeof data !== "object" || data === null) return false;
  const m = data as Record<string, unknown>;
  return (
    m.type === "brightspace-auth-token" &&
    typeof m.accessToken === "string" &&
    m.accessToken.length > 0
  );
};

// Single-line JS so it survives being put in a `javascript:` href.
// Mirrors the TUI's mint flow (api/auth.py): grab the XSRF referrer token,
// then POST it back to mint a fresh OAuth2 access token with scope=*:*:*.
const buildBookmarkletHref = (appOrigin: string): string => {
  const js =
    "(async()=>{" +
    "const host=location.host;" +
    "const expect='brightspace.algonquincollege.com';" +
    "const j=async(r,n)=>{" +
    "const ct=r.headers.get('content-type')||'';" +
    "if(!ct.includes('json')){" +
    "const t=await r.text();" +
    "throw new Error(n+': got '+ct+' from '+r.url+' (status '+r.status+'). First 120 chars: '+t.slice(0,120));" +
    "}" +
    "return r.json();" +
    "};" +
    "try{" +
    "if(host!==expect)throw new Error('Wrong tab: '+host+' (expected '+expect+'). Click the bookmarklet from a Brightspace tab.');" +
    "const x=await fetch('/d2l/lp/auth/xsrf-tokens',{credentials:'include'});" +
    "if(!x.ok)throw new Error('XSRF status '+x.status);" +
    "const xj=await j(x,'xsrf-tokens');" +
    "const r=xj.referrerToken;" +
    "if(!r)throw new Error('No referrerToken in XSRF response. Keys: '+Object.keys(xj).join(','));" +
    "const t=await fetch('/d2l/lp/auth/oauth2/token',{method:'POST',credentials:'include',headers:{'Content-Type':'application/x-www-form-urlencoded','X-Csrf-Token':r},body:'scope=*:*:*'});" +
    "if(!t.ok)throw new Error('Token status '+t.status);" +
    "const tj=await j(t,'token mint');" +
    "if(!tj.access_token)throw new Error('No access_token in token response. Keys: '+Object.keys(tj).join(','));" +
    "if(window.opener&&!window.opener.closed){" +
    "window.opener.postMessage({type:'brightspace-auth-token',accessToken:tj.access_token}," +
    JSON.stringify(appOrigin) +
    ");" +
    "alert('Signed in to Course Assistant. You can close this tab.');" +
    "}else{" +
    "await navigator.clipboard.writeText(tj.access_token);" +
    "alert('Token copied to clipboard. Paste it into the Course Assistant.');" +
    "}" +
    "}catch(e){alert('Sign-in failed: '+(e&&e.message?e.message:e));}" +
    "})();";
  return "javascript:" + encodeURI(js);
};

export const MicrosoftSignIn = (): ReactElement => {
  const dispatch = useAppDispatch();
  const popupRef = useRef<Window | null>(null);
  const [status, setStatus] = useState<string>("");

  useEffect(() => {
    const onMessage = (e: MessageEvent): void => {
      if (e.origin !== BRIGHTSPACE_ORIGIN) return;
      if (!isAuthMessage(e.data)) return;
      dispatch(insertToken(e.data.accessToken));
      setStatus("Signed in. Click Validate to continue.");
      if (popupRef.current && !popupRef.current.closed) {
        popupRef.current.close();
      }
    };
    window.addEventListener("message", onMessage);
    return (): void => window.removeEventListener("message", onMessage);
  }, [dispatch]);

  const onSignIn = (): void => {
    setStatus("Opening Brightspace — sign in, then click the bookmarklet.");
    popupRef.current = window.open(
      BRIGHTSPACE_ORIGIN,
      "brightspace-sign-in",
      "popup,width=900,height=800",
    );
    if (!popupRef.current) {
      setStatus(
        "Couldn't open popup. Allow popups for this site and try again.",
      );
    }
  };

  const bookmarkletHref = buildBookmarkletHref(window.location.origin);

  return (
    <Paper sx={{ p: 2, mt: 4 }} elevation={3}>
      <Typography variant="h5">Sign in with Microsoft</Typography>
      <Typography sx={{ mt: 1 }}>
        One-time setup: drag this link to your bookmarks bar →{" "}
        <Link
          href={bookmarkletHref}
          onClick={(e: React.MouseEvent): void => e.preventDefault()}
          sx={{ fontWeight: "bold", cursor: "grab" }}
        >
          Brightspace Sign-In
        </Link>
      </Typography>
      <Typography sx={{ mt: 1 }}>
        Then click <strong>Sign in with Microsoft</strong>, log in if needed,
        and click the bookmarklet from the Brightspace tab.
      </Typography>
      <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
        <Button variant="contained" onClick={onSignIn}>
          Sign in with Microsoft
        </Button>
      </Box>
      {status && (
        <Typography sx={{ mt: 2, textAlign: "center" }}>{status}</Typography>
      )}
    </Paper>
  );
};
