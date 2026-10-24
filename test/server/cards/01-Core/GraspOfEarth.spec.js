describe('Grasp of Earth', function () {
    integration(function () {
        beforeEach(function () {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    inPlay: ['student-of-esoterica'],
                    hand: ['grasp-of-earth']
                }
            });

            this.student = this.player1.findCardByName('student-of-esoterica');
            this.grasp = this.player1.findCardByName('grasp-of-earth');
        });

        it('costs 1 fate with Earth affinity', function () {
            expect(this.player1.player.hasAffinity('earth')).toBe(true);
            const fate = this.player1.fate;
            this.player1.playAttachment(this.grasp, this.student);
            expect(this.grasp.parent).toBe(this.student);
            expect(this.player1.fate).toBe(fate - 1);
        });
    });
});

describe('Grasp of Earth and characters played as attachments', function () {
    integration(function () {
        beforeEach(function () {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    inPlay: ['student-of-esoterica'],
                    hand: ['grasp-of-earth']
                },
                player2: {
                    inPlay: ['togashi-initiate'],
                    hand: ['tattooed-wanderer']
                }
            });
            this.student = this.player1.findCardByName('student-of-esoterica');
            this.grasp = this.player1.playAttachment('grasp-of-earth', this.student);
            this.initiate = this.player2.findCardByName('togashi-initiate');
            this.wanderer = this.player2.findCardByName('tattooed-wanderer');
            this.noMoreActions();
            this.initiateConflict({
                attackers: [this.student],
                defenders: [this.initiate]
            });
            this.player2.pass();
            this.player1.clickCard(this.grasp);
        });

        it('still lets the opponent play a character as an attachment (EmeraldDB ruling)', function () {
            // playing it as a character stays blocked, so the attachment play starts directly
            this.player2.clickCard(this.wanderer);
            expect(this.player2).toBeAbleToSelect(this.initiate);
            this.player2.clickCard(this.initiate);
            expect(this.wanderer.parent).toBe(this.initiate);
        });
    });
});

describe('Grasp of Earth and a later change of control', function () {
    integration(function () {
        beforeEach(function () {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    honor: 8,
                    inPlay: ['student-of-esoterica'],
                    hand: ['grasp-of-earth', 'blackmail'],
                    dynastyDiscard: ['favorable-ground']
                },
                player2: {
                    honor: 12,
                    inPlay: ['togashi-initiate']
                }
            });
            this.student = this.player1.findCardByName('student-of-esoterica');
            this.grasp = this.player1.findCardByName('grasp-of-earth');
            this.ground = this.player1.placeCardInProvince('favorable-ground', 'province 1');
            this.initiate = this.player2.findCardByName('togashi-initiate');
            this.player1.playAttachment(this.grasp, this.student);
            this.noMoreActions();
            this.initiateConflict({
                attackers: [this.student],
                defenders: []
            });
            this.player2.pass();
            this.player1.clickCard(this.grasp);
            this.player2.pass();
            this.player1.clickCard('blackmail');
            this.player1.clickCard(this.initiate);
            this.player2.pass();
        });

        it('stops only the characters the opponent controls now (EmeraldDB ruling)', function () {
            expect(this.initiate.controller).toBe(this.player1.player);
            this.player1.clickCard(this.ground);
            this.player1.clickCard(this.initiate);
            expect(this.initiate.isParticipating()).toBe(true);
        });
    });
});

