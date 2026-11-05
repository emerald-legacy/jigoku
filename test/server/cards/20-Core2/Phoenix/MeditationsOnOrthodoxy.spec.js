describe('Meditations on Orthodoxy', function () {
    integration(function () {
        beforeEach(function () {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    hand: ['meditations-on-orthodoxy'],
                    inPlay: ['adept-of-the-waves', 'solemn-scholar', 'miya-mystic']
                },
                player2: {
                    inPlay: []
                }
            });

            this.meditationsOnOrthodoxy = this.player1.findCardByName('meditations-on-orthodoxy');
            this.adept = this.player1.findCardByName('adept-of-the-waves');
            this.solemn = this.player1.findCardByName('solemn-scholar');
            this.mystic = this.player1.findCardByName('miya-mystic');
            this.adept.bow();
            this.solemn.bow();
        });

        it('triggers when you pass a conflict', function () {
            this.noMoreActions();
            this.player1.clickPrompt('Pass Conflict');
            this.player1.clickPrompt('Yes');
            expect(this.player1).toHavePrompt('Triggered Abilities');
            expect(this.player1).toBeAbleToSelect(this.meditationsOnOrthodoxy);
        });

        it('must choose at least one character', function () {
            this.noMoreActions();
            this.player1.clickPrompt('Pass Conflict');
            this.player1.clickPrompt('Yes');
            this.player1.clickCard(this.meditationsOnOrthodoxy);
            expect(this.player1).toHavePrompt('Choose characters');
            expect(this.player1).not.toHavePromptButton('Done');
            this.player1.clickCard(this.adept);
            expect(this.player1).toHavePromptButton('Done');
            this.player1.clickPrompt('Done');
            expect(this.adept.bowed).toBe(false);
            expect(this.solemn.bowed).toBe(true);
            expect(this.meditationsOnOrthodoxy.location).toBe('conflict deck');
        });

        it('cannot be triggered when no character can be readied', function () {
            this.adept.ready();
            this.solemn.ready();
            this.noMoreActions();
            this.player1.clickPrompt('Pass Conflict');
            this.player1.clickPrompt('Yes');
            expect(this.getChatLogs(3)).toContain('player1 has chosen to pass their conflict opportunity');
            expect(this.player1).not.toHavePrompt('Triggered Abilities');
            expect(this.meditationsOnOrthodoxy.location).toBe('hand');
        });

        it('if triggered, readies 2 characters', function () {
            this.noMoreActions();
            this.player1.clickPrompt('Pass Conflict');
            this.player1.clickPrompt('Yes');
            this.player1.clickCard(this.meditationsOnOrthodoxy);
            expect(this.player1).toHavePrompt('Choose characters');
            expect(this.player1).toBeAbleToSelect(this.adept);
            expect(this.player1).toBeAbleToSelect(this.solemn);
            expect(this.player1).not.toBeAbleToSelect(this.mystic);

            this.player1.clickCard(this.adept);
            expect(this.player1).toHavePromptButton('Done');

            this.player1.clickCard(this.solemn);
            expect(this.player1).toHavePromptButton('Done');

            this.player1.clickPrompt('Done');
            expect(this.meditationsOnOrthodoxy.location).toBe('conflict deck');
            expect(this.getChatLogs(5)).toContain(
                'player1 plays Meditations on Orthodoxy to ready Adept of the Waves and Solemn Scholar'
            );
        });
    });
});

describe('Meditations on Orthodoxy from the discard pile', function () {
    integration(function () {
        beforeEach(function () {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    honor: 12,
                    conflictDiscard: ['meditations-on-orthodoxy'],
                    inPlay: ['adept-of-the-waves', 'miya-mystic']
                },
                player2: {
                    honor: 10,
                    inPlay: []
                }
            });

            this.meditationsOnOrthodoxy = this.player1.findCardByName('meditations-on-orthodoxy');
            this.adept = this.player1.findCardByName('adept-of-the-waves');
            this.adept.bow();
        });

        it('can be played from the discard pile while you are more honorable', function () {
            this.noMoreActions();
            this.player1.clickPrompt('Pass Conflict');
            this.player1.clickPrompt('Yes');
            expect(this.player1).toHavePrompt('Triggered Abilities');
            expect(this.player1).toBeAbleToSelect(this.meditationsOnOrthodoxy);
            this.player1.clickCard(this.meditationsOnOrthodoxy);
            this.player1.clickCard(this.adept);
            this.player1.clickPrompt('Done');
            expect(this.adept.bowed).toBe(false);
            expect(this.meditationsOnOrthodoxy.location).toBe('conflict deck');
            expect(this.player1.player.conflictDeck.at(-1)).toBe(this.meditationsOnOrthodoxy);
        });

        it('cannot be played from the discard pile while you are not more honorable', function () {
            this.player2.honor = 12;
            this.noMoreActions();
            this.player1.clickPrompt('Pass Conflict');
            this.player1.clickPrompt('Yes');
            expect(this.getChatLogs(3)).toContain('player1 has chosen to pass their conflict opportunity');
            expect(this.player1).not.toHavePrompt('Triggered Abilities');
            expect(this.meditationsOnOrthodoxy.location).toBe('conflict discard pile');
            expect(this.adept.bowed).toBe(true);
        });
    });
});
