describe('Opportunistic Rustler', function () {
    integration(function () {
        beforeEach(function () {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    fate: 5,
                    inPlay: ['opportunistic-rustler']
                },
                player2: {
                    inPlay: ['brash-samurai', 'diplomat-of-the-steppes', 'courtly-challenger', 'tengu-sensei']
                }
            });

            this.rustler = this.player1.findCardByName('opportunistic-rustler');

            this.brash = this.player2.findCardByName('brash-samurai');
            this.diplomat = this.player2.findCardByName('diplomat-of-the-steppes');
            this.courtly = this.player2.findCardByName('courtly-challenger');
            this.tengu = this.player2.findCardByName('tengu-sensei');

            this.sd1 = this.player2.findCardByName('shameful-display', 'province 1');


            this.player2.reduceDeckToNumber('dynasty deck', 0);
            this.player2.moveCard(this.tengu, 'dynasty deck');
            this.player2.moveCard(this.brash, 'dynasty deck');
            this.player2.moveCard(this.courtly, 'dynasty deck');
            this.player2.moveCard(this.diplomat, 'dynasty deck');
        });

        it('non cavalry', function () {
            this.noMoreActions();
            this.initiateConflict({
                attackers: [this.rustler],
                province: this.sd1
            });

            const mil = this.rustler.militarySkill;
            const pol = this.rustler.politicalSkill;

            expect(this.player1).toHavePrompt('Triggered Abilities');
            expect(this.player1).toBeAbleToSelect(this.rustler);
            this.player1.clickCard(this.rustler);

            expect(this.getChatLogs(5)).toContain('player1 uses Opportunistic Rustler to look at player2\'s dynasty deck');

            expect(this.player1).toHavePrompt('Select a card to reveal');
            expect(this.player1).not.toHavePromptButton('Take nothing');
            expect(this.player1).toHavePromptButton(this.brash.name);
            expect(this.player1).toHavePromptButton(this.courtly.name);
            expect(this.player1).not.toHavePromptButton(this.tengu.name);
            expect(this.player1).toHavePromptButton(this.diplomat.name);

            this.player1.clickPrompt(this.courtly.name);

            expect(this.rustler.militarySkill).toBe(mil + 2);
            expect(this.rustler.politicalSkill).toBe(pol);
            expect(this.courtly.location).toBe('province 1');
            expect(this.courtly.facedown).toBe(false);

            expect(this.getChatLogs(5)).toContain('player1 puts Courtly Challenger faceup into the attacked province and gives Opportunistic Rustler +2military');
            expect(this.getChatLogs(5)).toContain('player2 puts 2 cards on the bottom of their dynasty deck');
            expect(this.player2.player.dynastyDeck.length).toBe(3);
        });

        it('cavalry', function () {
            this.noMoreActions();
            this.initiateConflict({
                attackers: [this.rustler],
                province: this.sd1
            });

            const mil = this.rustler.militarySkill;
            const pol = this.rustler.politicalSkill;

            expect(this.player1).toHavePrompt('Triggered Abilities');
            expect(this.player1).toBeAbleToSelect(this.rustler);
            this.player1.clickCard(this.rustler);

            expect(this.getChatLogs(5)).toContain('player1 uses Opportunistic Rustler to look at player2\'s dynasty deck');

            expect(this.player1).toHavePrompt('Select a card to reveal');
            expect(this.player1).toHavePromptButton(this.brash.name);
            expect(this.player1).toHavePromptButton(this.courtly.name);
            expect(this.player1).not.toHavePromptButton(this.tengu.name);
            expect(this.player1).toHavePromptButton(this.diplomat.name);

            this.player1.clickPrompt(this.diplomat.name);

            expect(this.rustler.militarySkill).toBe(mil + 3);
            expect(this.rustler.politicalSkill).toBe(pol);
            expect(this.diplomat.location).toBe('removed from game');

            expect(this.getChatLogs(5)).toContain('player1 removes Diplomat of the Steppes from the game and gives Opportunistic Rustler +3military');
            expect(this.getChatLogs(5)).toContain('player2 puts 2 cards on the bottom of their dynasty deck');
            expect(this.player2.player.dynastyDeck.length).toBe(3);
        });
    });
});

describe('Opportunistic Rustler against a province with printed strength X', function () {
    integration(function () {
        beforeEach(function () {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    inPlay: ['opportunistic-rustler']
                },
                player2: {
                    provinces: ['the-roar-of-the-lioness']
                }
            });
            this.rustler = this.player1.findCardByName('opportunistic-rustler');
            this.roar = this.player2.findCardByName('the-roar-of-the-lioness');
        });

        it('looks at no cards, so it has no reaction (X counts as 0)', function () {
            this.noMoreActions();
            this.initiateConflict({
                type: 'military',
                attackers: [this.rustler],
                province: this.roar
            });
            expect(this.player1).not.toHavePrompt('Triggered Abilities');
        });
    });
});

describe('Opportunistic Rustler at a province copied by Illusionary Terrain', function () {
    integration(function () {
        beforeEach(function () {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    inPlay: ['opportunistic-rustler']
                },
                player2: {
                    fate: 5,
                    provinces: ['shameful-display', 'manicured-garden'],
                    inPlay: ['brash-samurai', 'diplomat-of-the-steppes', 'courtly-challenger', 'tengu-sensei'],
                    hand: ['illusionary-terrain']
                }
            });
            this.rustler = this.player1.findCardByName('opportunistic-rustler');
            this.display = this.player2.findCardByName('shameful-display', 'province 1');
            this.garden = this.player2.findCardByName('manicured-garden');
            this.garden.facedown = false;
            this.tengu = this.player2.findCardByName('tengu-sensei');
            this.player2.reduceDeckToNumber('dynasty deck', 0);
            for(const card of ['tengu-sensei', 'brash-samurai', 'courtly-challenger', 'diplomat-of-the-steppes']) {
                this.player2.moveCard(card, 'dynasty deck');
            }
            this.noMoreActions();
            this.initiateConflict({
                type: 'military',
                attackers: [this.rustler],
                province: this.display
            });
            this.player2.clickCard('illusionary-terrain');
            this.player2.clickCard(this.garden);
        });

        it('looks at as many cards as the copy\'s printed strength', function () {
            expect(this.display.printedStrength).toBe(4);
            this.player1.clickCard(this.rustler);
            expect(this.player1).toHavePromptButton(this.tengu.name);
        });
    });
});
