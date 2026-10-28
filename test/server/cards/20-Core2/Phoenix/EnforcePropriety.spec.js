describe('Enforce Propriety', function () {
    integration(function () {
        beforeEach(function () {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    inPlay: ['matsu-berserker', 'kitsu-spiritcaller'],
                    hand: ['a-perfect-cut']
                },
                player2: {
                    inPlay: ['adept-of-the-waves'],
                    hand: ['enforce-propriety']
                }
            });

            this.matsuBerserker = this.player1.findCardByName('matsu-berserker');
            this.spiritcallerBowed = this.player1.findCardByName('kitsu-spiritcaller');
            this.spiritcallerBowed.bow();

            this.perfectCut = this.player1.findCardByName('a-perfect-cut');
            this.enforcePropriety = this.player2.findCardByName('enforce-propriety');
            this.adeptOfTheWaves = this.player2.findCardByName('adept-of-the-waves');

            this.noMoreActions();
        });

        it('tax events', function () {
            const initialFateP1 = this.player1.fate;
            const initialFateP2 = this.player2.fate;
            this.initiateConflict({
                type: 'military',
                attackers: [this.matsuBerserker],
                defenders: []
            });

            this.player2.pass();
            this.player1.clickCard(this.perfectCut);
            this.player1.clickCard(this.matsuBerserker);
            expect(this.player2).toHavePrompt('Triggered Abilities');
            expect(this.player2).toBeAbleToSelect(this.enforcePropriety);

            this.player2.clickCard(this.enforcePropriety);
            expect(this.getChatLogs(5)).toContain('player2 plays Enforce Propriety to enforce the proper protocol');
            expect(this.player1).toHavePrompt('Select one');
            expect(this.player1).toHavePromptButton('Give 1 fate to player2');
            expect(this.player1).toHavePromptButton('Let the effects be canceled');

            this.player1.clickPrompt('Give 1 fate to player2');
            expect(this.player1.fate).toBe(initialFateP1 - 1);
            expect(this.player2.fate).toBe(initialFateP2 + 1);
            expect(this.matsuBerserker.militarySkill).toBe(5);
            expect(this.getChatLogs(5)).toContain(
                'player1 gives 1 fate to player2 - the fortunes will be appeased, order is maintained'
            );
        });

        it('cancel events', function () {
            const initialFateP1 = this.player1.fate;
            const initialFateP2 = this.player2.fate;
            this.initiateConflict({
                type: 'military',
                attackers: [this.matsuBerserker],
                defenders: []
            });

            this.player2.pass();
            this.player1.clickCard(this.perfectCut);
            this.player1.clickCard(this.matsuBerserker);
            expect(this.player2).toHavePrompt('Triggered Abilities');
            expect(this.player2).toBeAbleToSelect(this.enforcePropriety);

            this.player2.clickCard(this.enforcePropriety);
            expect(this.getChatLogs(5)).toContain('player2 plays Enforce Propriety to enforce the proper protocol');
            expect(this.player1).toHavePrompt('Select one');
            expect(this.player1).toHavePromptButton('Give 1 fate to player2');
            expect(this.player1).toHavePromptButton('Let the effects be canceled');

            this.player1.clickPrompt('Let the effects be canceled');
            expect(this.player1.fate).toBe(initialFateP1);
            expect(this.player2.fate).toBe(initialFateP2);
            expect(this.matsuBerserker.militarySkill).toBe(3);
            expect(this.getChatLogs(5)).toContain(
                'player1 refuses to appease the fortunes - the effects of A Perfect Cut are canceled'
            );
        });
    });
});

describe('Enforce Propriety on its controller\'s own event', function () {
    integration(function () {
        beforeEach(function () {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    inPlay: ['matsu-berserker']
                },
                player2: {
                    inPlay: ['adept-of-the-waves'],
                    hand: ['enforce-propriety', 'banzai']
                }
            });
            this.player2.player.optionSettings.cancelOwnAbilities = true;

            this.matsuBerserker = this.player1.findCardByName('matsu-berserker');
            this.enforcePropriety = this.player2.findCardByName('enforce-propriety');
            this.banzai = this.player2.findCardByName('banzai');

            this.noMoreActions();
        });

        it('cancels the event', function () {
            this.initiateConflict({
                type: 'military',
                attackers: [this.matsuBerserker],
                defenders: []
            });
            const initialFateP1 = this.player1.fate;
            const initialFateP2 = this.player2.fate;
            const initialSkill = this.matsuBerserker.militarySkill;

            this.player2.clickCard(this.banzai);
            this.player2.clickCard(this.matsuBerserker);
            this.player2.clickCard(this.enforcePropriety);
            expect(this.player1).not.toHavePrompt('Select one');
            expect(this.player2).not.toHavePrompt('Select one');
            expect(this.matsuBerserker.militarySkill).toBe(initialSkill);
            expect(this.player1.fate).toBe(initialFateP1);
            expect(this.player2.fate).toBe(initialFateP2);
            expect(this.getChatLogs(5)).toContain('player2 plays Enforce Propriety to enforce the proper protocol');
        });
    });
});

describe('Enforce Propriety and The Mirror\'s Gaze', function () {
    integration(function () {
        beforeEach(function () {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    inPlay: ['asahina-storyteller', 'matsu-berserker'],
                    hand: ['the-mirror-s-gaze', 'a-perfect-cut']
                },
                player2: {
                    inPlay: ['adept-of-the-waves', 'solemn-scholar'],
                    hand: ['enforce-propriety']
                }
            });
            this.storyteller = this.player1.findCardByName('asahina-storyteller');
            this.berserker = this.player1.findCardByName('matsu-berserker');
            this.perfectCut = this.player1.findCardByName('a-perfect-cut');
            this.enforcePropriety = this.player2.findCardByName('enforce-propriety');
            this.mirrorGaze = this.player1.playAttachment('the-mirror-s-gaze', 'asahina-storyteller');
            this.storyteller.bow();
            this.noMoreActions();
            this.initiateConflict({
                type: 'military',
                attackers: [this.berserker],
                defenders: []
            });
            this.player2.pass();
        });

        // ruling #376: the Gaze cannot copy an interrupt that cancels a card effect
        it('should not be copied after the fate was paid', function () {
            const p2Fate = this.player2.fate;
            this.player1.clickCard(this.perfectCut);
            this.player1.clickCard(this.berserker);
            this.player2.clickCard(this.enforcePropriety);
            this.player1.clickPrompt('Give 1 fate to player2');
            expect(this.player2.fate).toBe(p2Fate + 1);
            expect(this.player1).not.toBeAbleToSelect(this.mirrorGaze);
            expect(this.player1).not.toHavePrompt('Triggered Abilities');
        });
    });
});
