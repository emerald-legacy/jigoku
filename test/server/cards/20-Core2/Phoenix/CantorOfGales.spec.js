describe('Cantor of Gales', function () {
    integration(function () {
        beforeEach(function () {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    inPlay: ['cantor-of-gales', 'adept-of-the-waves', 'seeker-initiate'],
                    hand: ['impossible-koan']
                }
            });
            this.cantor = this.player1.findCardByName('cantor-of-gales');
            this.adeptHonorable = this.player1.findCardByName('adept-of-the-waves');
            this.seekerOrdinary = this.player1.findCardByName('seeker-initiate');

            this.cantor.honor();
            this.adeptHonorable.honor();

            this.noMoreActions();
        });

        it('does nothing without an honorable character', function () {
            this.initiateConflict({
                attackers: [this.seekerOrdinary],
                defenders: [],
                type: 'military'
            });
            expect(this.game.currentConflict.attackerSkill).toBe(1);
        });

        it('contributes base skill from home when controller has honorale char in conflict', function () {
            this.initiateConflict({
                attackers: [this.adeptHonorable],
                defenders: [],
                type: 'military'
            });
            expect(this.game.currentConflict.attackerSkill).toBe(6);
        });

        it('contributes base skill from home when controller has honorale char in conflict, even while bowed', function () {
            this.cantor.bow();

            this.initiateConflict({
                attackers: [this.adeptHonorable],
                defenders: [],
                type: 'military'
            });
            expect(this.game.currentConflict.attackerSkill).toBe(6);
        });

        it('contributes its current base skill, not its printed skill', function () {
            this.initiateConflict({
                attackers: [this.adeptHonorable],
                defenders: [],
                type: 'military'
            });
            this.player2.pass();
            this.player1.clickCard('impossible-koan');
            expect(this.cantor.getBaseMilitarySkill()).toBe(1);
            // Adept: base 1 + 2 glory from honored; Cantor: base 1
            expect(this.game.currentConflict.attackerSkill).toBe(4);
        });

        it('does not work while participating', function () {
            this.initiateConflict({
                attackers: [this.cantor, this.adeptHonorable],
                defenders: [],
                type: 'military'
            });
            expect(this.game.currentConflict.attackerSkill).toBe(8);
        });
    });
});

describe('Cantor of Gales\'s ability gained through Contemplative Wisdom', function () {
    integration(function () {
        beforeEach(function () {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    inPlay: [{ card: 'cantor-of-gales', attachments: ['contemplative-wisdom'] }, 'adept-of-the-waves', 'doji-challenger'],
                    hand: ['retreat']
                },
                player2: {
                    inPlay: ['solemn-scholar']
                }
            });
            this.cantor = this.player1.findCardByName('cantor-of-gales');
            this.adept = this.player1.findCardByName('adept-of-the-waves');
            this.challenger = this.player1.findCardByName('doji-challenger');
            this.adept.honor();
            this.player1.claimRing('air');
        });

        it('contributes the base skill of the character that gained it', function () {
            this.noMoreActions();
            this.initiateConflict({
                type: 'military',
                attackers: [this.adept, this.challenger],
                defenders: [],
                ring: 'fire'
            });
            this.player2.pass();
            this.player1.clickCard(this.cantor);
            this.player1.clickCard(this.challenger);
            this.player1.clickRing('air');
            this.player2.pass();
            this.player1.clickCard('retreat');
            this.player1.clickCard(this.challenger);
            expect(this.challenger.isParticipating()).toBe(false);
            expect(this.game.currentConflict.attackerSkill).toBe(
                this.adept.militarySkill + this.cantor.getBaseMilitarySkill() + this.challenger.getBaseMilitarySkill()
            );
        });
    });
});

describe('Cantor of Gales with characters on the other side than their controller', function () {
    integration(function () {
        beforeEach(function () {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    inPlay: ['cantor-of-gales', 'endless-plains-skirmisher', 'doji-challenger']
                },
                player2: {
                    inPlay: ['solemn-scholar', 'endless-plains-skirmisher']
                }
            });
            this.cantor = this.player1.findCardByName('cantor-of-gales');
            this.skirmisher1 = this.player1.findCardByName('endless-plains-skirmisher');
            this.challenger = this.player1.findCardByName('doji-challenger');
            this.scholar = this.player2.findCardByName('solemn-scholar');
            this.skirmisher2 = this.player2.findCardByName('endless-plains-skirmisher');

            this.noMoreActions();
            this.initiateConflict({
                type: 'military',
                attackers: [this.challenger],
                defenders: [this.scholar]
            });
            expect(this.game.currentConflict.attackerSkill).toBe(3);
        });

        it('does not contribute when your only honored participant is on the enemy side', function () {
            this.skirmisher1.honor();
            this.player2.pass();
            this.player1.clickCard(this.skirmisher1);
            this.player1.clickPrompt('player2');
            expect(this.game.currentConflict.defenders).toContain(this.skirmisher1);
            expect(this.game.currentConflict.attackerSkill).toBe(3);
        });

        it('contributes when an opponent\'s honored character is on your side', function () {
            this.skirmisher2.honor();
            this.player2.clickCard(this.skirmisher2);
            this.player2.clickPrompt('player1');
            expect(this.game.currentConflict.attackers).toContain(this.skirmisher2);
            // Challenger 3 + honored Skirmisher 4 + Cantor's base 2
            expect(this.game.currentConflict.attackerSkill).toBe(9);
        });
    });
});
