describe('A gained ability on a copied card (Shosuro Actor copying a Dire Yogo Paramour)', function () {
    integration(function () {
        beforeEach(function () {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    inPlay: ['shosuro-actor']
                },
                player2: {
                    inPlay: ['yogo-paramour', 'doji-whisperer']
                }
            });
            this.actor = this.player1.findCardByName('shosuro-actor');
            this.paramour = this.player2.findCardByName('yogo-paramour');
            this.whisperer = this.player2.findCardByName('doji-whisperer');

            this.noMoreActions();
            this.initiateConflict({
                attackers: [this.actor],
                defenders: [],
                type: 'military'
            });
            this.player2.pass();
            this.player1.clickCard(this.actor);
            this.player1.clickCard(this.paramour);
            expect(this.actor.name).toBe('Yogo Paramour');
        });

        it('lets player2 still use their own Paramour\'s gained action', function () {
            expect(this.player2).toHavePrompt('Conflict Action Window');
            this.player2.clickCard(this.paramour);
            expect(this.player2).toHavePrompt('Choose a character');
            this.player2.clickCard(this.whisperer);
            expect(this.paramour.bowed).toBe(true);
            expect(this.actor.bowed).toBe(false);
            expect(this.whisperer.isDishonored).toBe(true);
        });

        it('does not let player1 use the Actor\'s ability by clicking player2\'s Paramour', function () {
            this.player2.pass();
            expect(this.player1).toHavePrompt('Conflict Action Window');
            this.player1.clickCard(this.paramour);
            expect(this.player1).toHavePrompt('Conflict Action Window');
            expect(this.actor.bowed).toBe(false);
        });
    });
});

describe('A gained ability granted again by a new instance of the same card (Voice of the Ancestors)', function () {
    integration(function () {
        beforeEach(function () {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    fate: 10,
                    inPlay: ['voice-of-the-ancestors', 'akodo-toturi', 'akodo-gunso'],
                    dynastyDiscard: ['matsu-berserker', 'lion-s-pride-brawler']
                }
            });
            this.voice = this.player1.findCardByName('voice-of-the-ancestors');
            this.toturi = this.player1.findCardByName('akodo-toturi');
            this.gunso = this.player1.findCardByName('akodo-gunso');
            this.berserker = this.player1.findCardByName('matsu-berserker');
            this.brawler = this.player1.findCardByName('lion-s-pride-brawler');
        });

        it('keeps the second Spirit\'s skill bonus when the first Spirit leaves play', function () {
            this.player1.clickCard(this.voice);
            this.player1.clickCard(this.toturi);
            this.player1.clickCard(this.berserker);
            expect(this.toturi.militarySkill).toBe(9);
            this.player2.pass();

            // a new instance of the card (it left play and came back) may use its action again (RRG Limits)
            this.player1.moveCard(this.voice, 'hand');
            this.player1.moveCard(this.voice, 'play area');
            expect(this.player1).toHavePrompt('Action Window');
            this.player1.clickCard(this.voice);
            this.player1.clickCard(this.gunso);
            this.player1.clickCard(this.brawler);
            expect(this.brawler.location).toBe('play area');
            expect(this.gunso.attachments).toContain(this.brawler);
            expect(this.gunso.militarySkill).toBe(5);

            this.player1.moveCard(this.berserker, 'dynasty discard pile');
            expect(this.toturi.militarySkill).toBe(6);
            expect(this.gunso.militarySkill).toBe(5);
        });
    });
});
