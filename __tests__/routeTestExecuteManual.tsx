import TestExecuteManual from 'src/routes/sharedComponents/testExecuteManual';
import * as fetchProvider from 'provider/fetch';
import * as writeProvider from "provider/write";
import { vi, type Mock } from 'vitest';
import { screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithProviders } from './test-utils/renderWithOptions';
import {
    loggedInUserRachelGreen
} from './test-utils/rachelGreenuser';