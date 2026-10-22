import { ResolvableAbility } from '../../../../../build/server/game/ResolvableAbility.js';
import { sacrifice } from '../../../../../build/server/game/GameActions/GameActions.js';

describe('Obstinate Witch Hunter', function () {
    integration(function () {
        beforeEach(function () {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    inPlay: ['obstinate-witch-hunter', 'obstinate-witch-hunter']
                },
                player2: {
                    inPlay: ['isawa-tadaka']
                }
            });

            this.hunter1 = this.player1.filterCardsByName('obstinate-witch-hunter')[0];
            this.hunter2 = this.player1.filterCardsByName('obstinate-witch-hunter')[1];

            this.tadaka = this.player2.findCardByName('isawa-tadaka');

            this.hunter1.fate = 1;
        });

        it('with another tainted character should not lose fate or be discarded', function () {
            this.tadaka.taint();
            this.advancePhases('fate');

            this.player2.clickPrompt('Done');
            expect(this.hunter1.fate).toBe(1);
            expect(this.hunter2.location).toBe('play area');
            expect(this.getChatLogs(5)).toContain('player1 uses Obstinate Witch Hunter to stop him being discarded or losing fate in this phase');
        });

        it('should ignore if self tained', function () {
            this.hunter1.taint();
            this.advancePhases('fate');

            this.player2.clickPrompt('Done');
            expect(this.hunter1.fate).toBe(0);
            expect(this.hunter2.location).toBe('play area');
        });
    });
});

describe('Obstinate Witch Hunter and sacrifices', function () {
    integration(function () {
        beforeEach(function () {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    inPlay: ['obstinate-witch-hunter']
                },
                player2: {
                    inPlay: ['isawa-tadaka']
                }
            });

            this.hunter = this.player1.findCardByName('obstinate-witch-hunter');
            this.tadaka = this.player2.findCardByName('isawa-tadaka');
            this.hunter.fate = 1;
        });

        it('cannot be sacrificed this phase', function () {
            this.tadaka.taint();
            this.advancePhases('fate');
            this.player2.clickPrompt('Done');

            const context = new ResolvableAbility(this.tadaka, {}).createContext(this.player2.player);
            this.game.queueSimpleStep(() => sacrifice().resolve(this.hunter, context));
            this.game.continue();
            expect(this.hunter.location).toBe('play area');
        });
    });
});
