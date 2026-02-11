import { test, expect } from '@playwright/test';
import { spawn } from 'child_process';
import * as fs from 'fs';
import * as path from 'path';

const PROJECT_ROOT = path.resolve(__dirname, '..');
const CLI_PATH = path.resolve(__dirname, '../dist/tree_gen.js');

let createdFiles: string[] = [];

function runCLI(inputs: string[]): Promise<string> {
  return new Promise((resolve, reject) => {
    let output = '';
    const child = spawn('node', [CLI_PATH], {cwd: PROJECT_ROOT});

    child.stdout.on('data', (data) => {
      output += data.toString();
    });

    child.stderr.on('data', (data) => {
      output += data.toString();
    });

    child.on('error', reject);

    inputs.forEach(input => {
      child.stdin.write(input + '\n');
    });
    child.stdin.end();

    child.on('close', () => resolve(output));
  });
}

test('creates tree file', async () => {
  const filePath = path.join(PROJECT_ROOT, `test_tree.txt`);
  createdFiles.push(filePath);

  await runCLI(['test_tree.txt', '3']);

  expect(fs.existsSync(filePath)).toBeTruthy();
});

test('invalid directory', async () => {
  const invalidpath = path.join(PROJECT_ROOT, 'some_invanid_dir', `${Math.random()}test_tree.tx`);
  const stdout = await runCLI([invalidpath]);

  expect(stdout).toContain("Directory does not exist");

  expect(fs.existsSync(invalidpath)).toBeFalsy();
});

test('invalid height', async () => {
  const invalidvalue = 'abc'
  const filePath = path.join(PROJECT_ROOT, `${Math.random()}test_tree.tx`);
  createdFiles.push(filePath);

  const stdout = await runCLI(['test_tree.txt', invalidvalue]);

  expect(stdout).toContain("Wrong value");
  expect(fs.existsSync(filePath)).toBeFalsy();
});

test.afterEach(async () => {
  
  for (const file of createdFiles) {
    if (fs.existsSync(file)) {
      fs.unlinkSync(file);
    }
  }
  createdFiles = [];
});
