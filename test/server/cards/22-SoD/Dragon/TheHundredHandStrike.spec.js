describe('The Hundred Hand Strike', function () {
    integration(function () {
        beforeEach(function () {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    inPlay: ['tattooed-wanderer'],
                    hand: ['the-hundred-hand-strike']
                },
                player2: {
                    inPlay: ['togashi-yokuni']
                }
            });

            this.monk = this.player1.findCardByName('tattooed-wanderer');
            this.strike = this.player1.findCardByName('the-hundred-hand-strike');
            this.yokuni = this.player2.findCardByName('togashi-yokuni');
        });

        it('discards a character with no fate that no longer contributes skill', function () {
            this.game.rings.fire.fate = 1;
            this.game.rings.void.fate = 1;
            this.yokuni.fate = 0;

            this.noMoreActions();
            this.initiateConflict({
                attackers: [this.monk],
                defenders: [this.yokuni]
            });

            this.player2.pass();
            this.player1.clickCard(this.strike);
            this.player1.clickCard(this.monk);
            this.player1.clickCard(this.yokuni);

            expect(this.yokuni.location).toBe('dynasty discard pile');
            expect(this.getChatLogs(5)).toContain('Togashi Yokuni is injured because it is not contributing skill to the current conflict');
        });
    });
});

describe('The Hundred Hand Strike with a Monk that is not Tattooed', function () {
    integration(function () {
        beforeEach(function () {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    inPlay: ['kuni-silencer'],
                    hand: ['the-hundred-hand-strike']
                },
                player2: {
                    inPlay: ['togashi-yokuni']
                }
            });

            this.silencer = this.player1.findCardByName('kuni-silencer');
            this.strike = this.player1.findCardByName('the-hundred-hand-strike');
            this.yokuni = this.player2.findCardByName('togashi-yokuni');
        });

        it('does not injure a character that contributes no skill', function () {
            this.game.rings.fire.fate = 1;
            this.game.rings.void.fate = 1;
            this.yokuni.fate = 1;

            this.noMoreActions();
            this.initiateConflict({
                attackers: [this.silencer],
                defenders: [this.yokuni]
            });

            this.player2.pass();
            this.player1.clickCard(this.strike);
            this.player1.clickCard(this.silencer);
            this.player1.clickCard(this.yokuni);

            expect(this.yokuni.militarySkill).toBe(0);
            expect(this.yokuni.fate).toBe(1);
            expect(this.yokuni.location).toBe('play area');
            expect(this.getChatLogs(5)).toContain('player1 plays The Hundred Hand Strike to give Togashi Yokuni -6military and -6political');
            expect(this.getChatLogs(5)).not.toContain('Togashi Yokuni is injured because it is not contributing skill to the current conflict');
        });
    });
});

describe('The Hundred Hand Strike limit', function () {
    integration(function () {
        beforeEach(function () {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    inPlay: ['tattooed-wanderer'],
                    hand: ['the-hundred-hand-strike', 'the-hundred-hand-strike']
                },
                player2: {
                    inPlay: ['togashi-yokuni']
                }
            });

            this.monk = this.player1.findCardByName('tattooed-wanderer');
            [this.strike1, this.strike2] = this.player1.filterCardsByName('the-hundred-hand-strike', 'hand');
            this.yokuni = this.player2.findCardByName('togashi-yokuni');
        });

        it('can be played only once per conflict', function () {
            this.noMoreActions();
            this.initiateConflict({
                attackers: [this.monk],
                defenders: [this.yokuni]
            });

            this.player2.pass();
            this.player1.clickCard(this.strike1);
            this.player1.clickCard(this.monk);
            this.player1.clickCard(this.yokuni);
            expect(this.yokuni.militarySkill).toBe(3);

            this.player2.pass();
            expect(this.player1).toHavePrompt('Conflict Action Window');
            this.player1.clickCard(this.strike2);
            expect(this.player1).toHavePrompt('Conflict Action Window');
            expect(this.strike2.location).toBe('hand');
            expect(this.yokuni.militarySkill).toBe(3);
        });
    });
});
