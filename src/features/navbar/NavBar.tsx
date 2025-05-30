import { useAppDispatch, useAppSelector } from "../../app/hooks"

import { startTeleprompter, stopTeleprompter } from "../../app/thunks"

import {
  toggleEdit,
  flipHorizontally,
  flipVertically,
  setFontSize,
  setMargin,
  setOpacity,
  selectStatus,
  selectHorizontallyFlipped,
  selectVerticallyFlipped,
  selectFontSize,
  selectMargin,
  selectOpacity,
} from "./navbarSlice"

import { loadContent, resetTranscriptionIndices, saveContent } 
from "../content/contentSlice"

export const NavBar = () => {
  const dispatch = useAppDispatch()

  const status = useAppSelector(selectStatus)
  const fontSize = useAppSelector(selectFontSize)
  const margin = useAppSelector(selectMargin)
  const opacity = useAppSelector(selectOpacity)
  const horizontallyFlipped = useAppSelector(selectHorizontallyFlipped)
  const verticallyFlipped = useAppSelector(selectVerticallyFlipped)

  return (
    <nav
      className="navbar is-black has-text-light is-unselectable"
      role="navigation"
      aria-label="main navigation"
    >
      <div className="navbar-brand">
        <div className="navbar-item">
          <div className="title has-text-grey">
            <div>Voice-Activated Teleprompter</div>
            <ul className="is-size-7">
              <li className="first has-text-white">
                &copy; Julien Lecomte (2024)
              </li>
              <li className="has-text-white">
                Multicode forked version
              </li>
              <li className="has-text-warning hidden-by-matt">
                <i className="fa-solid fa-triangle-exclamation"></i> Only works
                in Chrome
              </li>
              <li className="last hidden-by-matt">
                <a href="https://www.paypal.com/donate/?hosted_button_id=49UXY8F6VVYFA">
                  Support this project
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div className="navbar-end">
        {status === "stopped" ? (
          <>
            <div className="navbar-item slider">
              <span>Font size:</span>
              <input
                type="range"
                step="5"
                min="10"
                max="200"
                value={fontSize}
                onChange={e =>
                  dispatch(setFontSize(parseInt(e.currentTarget.value, 10)))
                }
              />
            </div>
            <div className="navbar-item slider">
              <span>Margin:</span>
              <input
                type="range"
                step="10"
                min="0"
                max="500"
                value={margin}
                onChange={e =>
                  dispatch(setMargin(parseInt(e.currentTarget.value, 10)))
                }
              />
            </div>
            <div className="navbar-item slider">
              <span>Brightness:</span>
              <input
                type="range"
                step="10"
                min="0"
                max="100"
                value={opacity}
                onChange={e =>
                  dispatch(setOpacity(parseInt(e.currentTarget.value, 10)))
                }
              />
            </div>
          </>
        ) : null}

        <div className="buttons navbar-item">
          {status !== "started" ? (
            <>
              <button
                className={`button ${status === "editing" ? "editing" : ""}`}
                onClick={() => dispatch(toggleEdit())}
                title="Edit"
              >
                <span className="icon is-small">
                  <i className="fa-solid fa-pencil" />
                </span>
              </button>
              <button
                className="button"
                disabled={status !== "stopped"}
                onClick={() => dispatch(saveContent())}
                title="Save"
              >
                <span className="icon is-small">
                  <i className="fa-solid fa-floppy-disk" />
                </span>
              </button>
              <button
                className="button"
                disabled={status !== "stopped"}
                onClick={() => dispatch(loadContent())}
                title="Load"
              >
                <span className="icon is-small">
                  <i className="fa-solid fa-folder-open" />
                </span>
              </button>
              <button
                className={`button ${horizontallyFlipped ? "horizontally-flipped" : ""}`}
                disabled={status !== "stopped"}
                onClick={() => dispatch(flipHorizontally())}
                title="Flip Text Horizontally"
              >
                <span className="icon is-small">
                  <i className="fa-solid fa-left-right" />
                </span>
              </button>
              <button
                className={`button ${verticallyFlipped ? "vertically-flipped" : ""}`}
                disabled={status !== "stopped"}
                onClick={() => dispatch(flipVertically())}
                title="Flip Text Vertically"
              >
                <span className="icon is-small">
                  <i className="fa-solid fa-up-down" />
                </span>
              </button>
              <button
                className="button"
                disabled={status !== "stopped"}
                onClick={() => dispatch(resetTranscriptionIndices())}
                title="Restart from the beginning"
              >
                <span className="icon is-small">
                  <i className="fa-solid fa-arrows-rotate" />
                </span>
              </button>
            </>
          ) : null}

          <button
            className="button"
            disabled={status === "editing"}
            onClick={() =>
              dispatch(
                status === "stopped" ? startTeleprompter() : stopTeleprompter(),
              )
            }
            title={
              status === "stopped" || status === "editing" ? "Start" : "Stop"
            }
          >
            <span className="icon is-small">
              <i
                className={`fa-solid ${status === "stopped" || status === "editing" ? "fa-play" : "fa-stop"}`}
              />
            </span>
          </button>
        </div>
      </div>
    </nav>
  )
}
