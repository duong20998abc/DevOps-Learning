import { spawn } from 'child_process'
import process from 'process'

export function cmd(...command: string[]) {
  let p = spawn(command[0], command.slice(1))
  return new Promise((resolve, reject) => {
    p.stdout.on('data', (x) => {
      process.stdout.write(x.toString())
    })
    p.stderr.on('data', (x) => {
      process.stderr.write(x.toString())
      reject(x)
    })
    p.on('exit', (code) => {
      resolve(code)
    })
  })
}
