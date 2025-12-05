// This Vite config file (vite.config.js) tells Rollup (production bundler) 
// to treat multiple HTML files as entry points so each becomes its own built page.

import { defineConfig } from "vite";
import { resolve } from "path";

export default defineConfig({
    build: {
        rollupOptions: {
            input: {
                index: resolve(__dirname, "index.html"),
                login: resolve(__dirname, "login.html"),
                main: resolve(__dirname, "main.html"),
                profile: resolve(__dirname, "profile.html"),
                review: resolve(__dirname, "review.html"),
                faq: resolve(__dirname, "faq.html"),
                taskDetail: resolve(__dirname, "taskDetail.html"),
                addTask: resolve(__dirname, "addTask.html"),
                viewTasks: resolve(__dirname, "viewTasks.html"),
                completedTask: resolve(__dirname, "completedTask.html"),
                groups: resolve(__dirname, "groups.html"),
                groupCreate: resolve(__dirname, "groupCreate.html"),
                groupAddTask: resolve(__dirname, "groupAddTask.html"),
                groupDetail: resolve(__dirname, "groupDetail.html"),
                groupTasks: resolve(__dirname, "groupTasks.html"),
                taskDetailGroup: resolve(__dirname, "taskDetailGroup.html"),
            }
        }
    }
});
