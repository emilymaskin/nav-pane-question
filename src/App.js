import "./styles.css";
import { useRef, useEffect, useState } from "react";
import { debounce } from "debounce";

const DummyText =
  "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.";

export default function App() {
  const mainRef = useRef();
  const [headers, setHeaders] = useState([]);
  const [currentHeader, setCurrentHeader] = useState(null);

  useEffect(() => {
    const formattedHeaders = [];
    let headerObj = { H2: { node: null, children: [] } };
    const headerArray = Array.from([
      ...mainRef.current.children
    ]).filter((node) => ["H2", "H3"].includes(node.tagName));

    headerArray.forEach((node, index) => {
      if (node.tagName === "H2") {
        headerObj = { H2: { node: null, children: [] } };
        headerObj.H2.node = node;
      } else {
        headerObj.H2.children.push(node);
      }
      if (
        index === headerArray.length - 1 ||
        headerArray[index + 1].tagName === "H2"
      ) {
        formattedHeaders.push(headerObj);
      }
    });

    setHeaders(formattedHeaders);

    const onScroll = () => {
      const scrolledPastEls = headerArray.filter(
        (el) => el.getBoundingClientRect().y < window.innerHeight / 2
      );

      const nextEl = scrolledPastEls.pop();
      if (nextEl) {
        setCurrentHeader(nextEl.innerText);
      }
    };

    onScroll();

    window.addEventListener("scroll", debounce(onScroll, 10));

    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const NavLink = ({ text, children }) => {
    const scrollToHeader = () => {
      const header = Array.from([...mainRef.current.children]).find(
        (node) => node.innerText === text
      );
      header.scrollIntoView({ behavior: "smooth" });
    };

    const onClick = () => {
      scrollToHeader();
      setCurrentHeader(text);
    };

    return (
      <li>
        <span
          className={currentHeader === text ? "current" : ""}
          onClick={onClick}
        >
          {text}
        </span>
        {children ? (
          <ul>
            {children.map((child) => (
              <NavLink key={child.innerText} text={child.innerText} />
            ))}
          </ul>
        ) : null}
      </li>
    );
  };

  return (
    <div className="container">
      <main ref={mainRef}>
        <h2 id="initial-header">Initial header</h2>
        <p>{DummyText}</p>
        <h2 id="second-header">Second header</h2>
        <p>{DummyText}</p>
        <h3 id="third-header">Third header</h3>
        <p>{DummyText}</p>
        <p>{DummyText}</p>
        <h2 id="fourth-header">Fourth header</h2>
        <p>{DummyText}</p>
        <p>{DummyText}</p>
        <p>{DummyText}</p>
        <p>{DummyText}</p>
        <h3 id="fifth-header">Fifth header</h3>
        <p>{DummyText}</p>
        <p>{DummyText}</p>
      </main>
      <nav aria-label="Table of contents">
        <ul>
          {headers.map((header) => (
            <NavLink
              key={header.H2.node.innerText}
              text={header.H2.node.innerText}
              children={header.H2.children}
            />
          ))}
        </ul>
      </nav>
    </div>
  );
}
