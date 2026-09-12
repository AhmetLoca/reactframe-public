export interface Testimonial {
  name: string;
  /** X handle, e.g. "@name" — shown under the name. Omit for Framer reviews. */
  handle?: string;
  avatar?: string;
  verified?: boolean;
  /** Small pill next to the name, e.g. "Expert" (Framer community role). */
  badge?: string;
  quote: string;
  url: string;
  /** Which logo shows top-right and where `url` points to. @default "x" */
  source?: "x" | "framer";
}

export const testimonials: Testimonial[] = [
  {
    name: "Joseph Todaro",
    handle: "@Jatodaro",
    avatar: "/testimonials/joseph-todaro.jpg",
    verified: true,
    quote: "Keep crushing it my dudes",
    url: "https://x.com/Jatodaro/status/2074966549333762472",
  },
  {
    name: "Asif Ali | Video Editor",
    handle: "@asifalihunzai",
    avatar: "/testimonials/asif-ali.jpg",
    verified: true,
    quote: "Clean cuts and perfect pacing",
    url: "https://x.com/asifalihunzai/status/2080020893426995265",
  },
  {
    name: "Ritesh Nayak",
    handle: "@riteshhn",
    avatar: "/testimonials/ritesh-nayak.jpg",
    verified: true,
    quote: "That's cool!",
    url: "https://x.com/riteshhn/status/2074828943056933344",
  },
  {
    name: "Gustav ❖",
    handle: "@gustavwf",
    avatar: "/testimonials/gustav.jpg",
    verified: true,
    quote: "Congrats! Keep it going 🔥",
    url: "https://x.com/gustavwf/status/2074575225413357692",
  },
  {
    name: "Crownz | AI & Design",
    handle: "@Crownzdesigns",
    avatar: "/testimonials/crownz.jpg",
    verified: true,
    quote: "Congrats",
    url: "https://x.com/Crownzdesigns/status/2074454870170460595",
  },
  {
    name: "James Hicks",
    handle: "@jhicks2306",
    avatar: "/testimonials/james-hicks.jpg",
    verified: true,
    quote: "Nice one. Keep shipping!",
    url: "https://x.com/jhicks2306/status/2069814356255092983",
  },
  {
    name: "Noah Frummerin",
    avatar: "/testimonials/noah-frummerin.jpg",
    badge: "Expert",
    quote: "Super smooth, great stuff Ahmet!",
    url: "https://www.framer.com/community/posts/3pANcEFt1LgH5tsKKvXYRe/?commentId=7vtBm9MdWUFuHT2pTnt9G4",
    source: "framer",
  },
  {
    name: "Freddie",
    avatar: "/testimonials/freddie.jpg",
    quote: "love this, great component!",
    url: "https://www.framer.com/community/posts/UkehhtVfMyVne73YnBAq9V/?commentId=2upCF6FmjMFWmorzPqjnWe",
    source: "framer",
  },
  {
    name: "Arini Studio",
    avatar: "/testimonials/arini-studio.jpg",
    badge: "Pro Expert",
    quote: "Super clean.",
    url: "https://www.framer.com/community/posts/LtQkam97n1KpK2n8wQ5ob1/?commentId=548Qrvfzb1UEpXc8sqxU6C",
    source: "framer",
  },
  {
    name: "Wes Ambler",
    avatar: "/testimonials/wes-ambler.jpg",
    badge: "Expert",
    quote: "Supa clean !!",
    url: "https://www.framer.com/community/posts/SWfggRruxi5dB5t6UQN17e/?commentId=PXZsTRg3aBGuaNcqVhVGy",
    source: "framer",
  },
  {
    name: "Matt",
    avatar: "/testimonials/matt.jpg",
    badge: "Expert",
    quote: "Great job Ahmet, I love the preview, how did you build it?",
    url: "https://www.framer.com/community/posts/3L4HjnbWRmh5nvSJkiUvsD/?commentId=NK1E7JsvFnRxSfPqfNSDmT",
    source: "framer",
  },
  {
    name: "Raymond A.O",
    avatar: "/testimonials/raymond-ao.jpg",
    badge: "Expert",
    quote: "looks goood",
    url: "https://www.framer.com/community/posts/FYbxwMCESmvfvrGLSf72DM/?commentId=9NaoTyBuRLhGvSYjT83mtR",
    source: "framer",
  },
];
