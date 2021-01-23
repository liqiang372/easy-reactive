import React from 'react'

export const Button = ({ children, onClick, type = 'emit' }) => {
  return (
    <>
      <button className={type} onClick={onClick}>{children}</button>
      <style jsx>{`
        button {
          border: none;
          outline: none;
          display: inline-flex;
          justify-content: center;
          align-items: center;
          max-height: 36px;
          min-height: 36px;
          border-radius: 18px;
          background-color: #efefef;
          box-shadow: 4px 4px 4px #d8dee9;
          color: grey;
          padding: 12px;
          cursor: pointer;
          min-width: 80px;
        }
        button:active {
          box-shadow: inset 2px 2px 8px #dee0e4;
        }
        button.emit:active {
          background-color:rgba(133, 185, 250, .2);
          color: rgb(133, 185, 250);
        }
        button.complete:active {
          background-color: rgba(44, 159, 100, .2);
          color: rgb(44, 159, 100)
        }

        button.reset {
          background-color: #fae55e;
        }

        button.error {
          background-color: #f6b3c2;
        }
      `}</style>
    </>
  )
}