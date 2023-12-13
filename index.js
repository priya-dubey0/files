import fs from 'fs';

import schemeJson from './json/scheme.json' assert { type: 'json' };
import syllabusJson from './json/syllabus.json' assert { type: 'json' };
import timetableJson from './json/timetable.json' assert { type: 'json' };

import { fileNameGenerator, downloadHelper, waitForMe } from './helper/index.js'

/**
 * Downloads PDF files for all schemes in a given JSON structure and organizes them in a directory structure.
 */
const allSchemeFileDownloader = async () => {
    try {
        // Iterate through each program in the schemeJson
        for (const programObject of schemeJson) {
            const programName = programObject.name;

            // Iterate through each scheme in the program
            for (const schemeObject of programObject.schemes) {
                const schemeName = schemeObject.name;

                // Iterate through each PDF in the scheme
                for (const pdfsObject of schemeObject.pdfs) {
                    const semesterName = pdfsObject.semester ? pdfsObject.semester : '0th Semester';

                    // Construct the download path based on program, scheme, and semester
                    const downloadPath = `files/scheme/${programName.replace(/\./gm, '')}/${schemeName}/${semesterName}/`;

                    // Create the directory if it doesn't exist
                    if (!fs.existsSync(downloadPath)) {
                        console.log(`Creating new folder for allSchemeFileDownloader with path: ${downloadPath}`);
                        fs.mkdirSync(downloadPath, { recursive: true });
                    }

                    // Get the PDF URL and generate a unique filename
                    const pdfUrl = pdfsObject.url;
                    const fileName = await fileNameGenerator(pdfUrl);

                    // Download the PDF and log the download status
                    await downloadHelper(pdfUrl, downloadPath, fileName);
                    await waitForMe(1000);
                }
            }
        }
    } catch (error) {
        console.error('Something went wrong with allSchemeFileDownloader:', error);
    }
};

const allSyllabusFileDownloader = async () => {
    try {
        // Iterate through each program in the syllabusJson
        for (const programObject of syllabusJson) {
            const programName = programObject.name;

            // Iterate through each syllabus in the program
            for (const syllabusObject of programObject.syllabus) {
                const syllabusName = syllabusObject.name;

                // Iterate through each PDF in the syllabus
                for (const pdfsObject of syllabusObject.pdfs) {
                    const semesterName = pdfsObject.semester ? pdfsObject.semester : '0th Semester';

                    // Construct the download path based on program, syllabus, and semester
                    const downloadPath = `files/syllabus/${programName.replace(/\./gm, '')}/${syllabusName}/${semesterName}/`;

                    // Create the directory if it doesn't exist
                    if (!fs.existsSync(downloadPath)) {
                        console.log(`Creating new folder for allSyllabusFileDownloader with path: ${downloadPath}`);
                        fs.mkdirSync(downloadPath, { recursive: true });
                    }

                    // Get the PDF URL and generate a unique filename
                    const pdfUrl = pdfsObject.url;
                    const fileName = await fileNameGenerator(pdfUrl);

                    // Download the PDF and log the download status
                    await downloadHelper(pdfUrl, downloadPath, fileName);
                    await waitForMe(1000);
                }
            }
        }
    } catch (error) {
        console.error('Something went wrong with allSyllabusFileDownloader:', error);
    }
};


const allTimeTableFileDownloader = async () => {
    try {
        // Iterate through each program in the timetableJson
        for (const programObject of timetableJson) {
            const programName = programObject.programName;

            // Iterate through each timetable in the program
            for (const timetableObject of programObject.programDataList) {
                const semesterName = timetableObject.semester ? timetableObject.semester : '0th Semester';

                // Construct the download path based on program, timetable, and semester
                const downloadPath = `files/timetable/${programName.replace(/\./gm, '')}/${semesterName}/`;

                // Create the directory if it doesn't exist
                if (!fs.existsSync(downloadPath)) {
                    console.log(`Creating new folder for allTimeTableFileDownloader with path: ${downloadPath}`);
                    fs.mkdirSync(downloadPath, { recursive: true });
                }

                // Get the PDF URL and generate a unique filename
                const pdfUrl = timetableObject.url;
                const fileName = await fileNameGenerator(pdfUrl);

                // Download the PDF and log the download status
                await downloadHelper(pdfUrl, downloadPath, fileName);
                await waitForMe(1000);
            }
        }
    } catch (error) {
        console.error('Something went wrong with allTimeTableFileDownloader:', error);
    }
};


async function executeOneByOne() {
    // If you want to run them concurrently
    // await Promise.all([allSchemeFileDownloader(), allSyllabusFileDownloader(), allTimeTableFileDownloader()]);

    // Execute sequentially so that we are not blocked by RGPV for too many concurrent requests
    await allSchemeFileDownloader();
    await allSyllabusFileDownloader();
    await allTimeTableFileDownloader();
}

executeOneByOne();
