describe('Shore of the Ashen Flames', function () {
    integration(function () {
        beforeEach(function () {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    inPlay: ['aggressive-moto', 'kakita-yoshi'],
                    hand: [
                        'a-perfect-cut',
                        'fine-katana',
                        'curved-blade',
                        'invocation-of-ash',
                        'fiery-madness'
                    ]
                },
                player2: {
                    inPlay: ['togashi-initiate'],
                    hand: ['fine-katana'],
                    provinces: ['shore-of-the-ashen-flames']
                }
            });

            this.yoshi = this.player1.findCardByName('kakita-yoshi');
            this.aggressiveMoto = this.player1.findCardByName('aggressive-moto');
            this.perfectCut = this.player1.findCardByName('a-perfect-cut');
            this.fineKatana = this.player1.findCardByName('fine-katana');
            this.curvedBlade = this.player1.findCardByName('curved-blade');
            this.invocationOfAsh = this.player1.findCardByName('invocation-of-ash');
            this.fieryMadness = this.player1.findCardByName('fiery-madness');
            this.katana2 = this.player2.findCardByName('fine-katana');
            this.initiate = this.player2.findCardByName('togashi-initiate');

            this.shoreOfTheAshenFlames = this.player2.findCardByName(
                'shore-of-the-ashen-flames',
                'province 1'
            );
        });

        it('denies attachment bonuses on attackers during resolution but not during the conflict', function () {
            this.noMoreActions();
            this.initiateConflict({
                attackers: [this.aggressiveMoto],
                defenders: [this.initiate],
                province: this.shoreOfTheAshenFlames,
                type: 'military'
            });

            expect(this.aggressiveMoto.militarySkill).toBe(3);
            expect(this.aggressiveMoto.politicalSkill).toBe(0);

            this.player2.pass();
            this.player1.clickCard(this.fineKatana);
            this.player1.clickCard(this.aggressiveMoto);
            expect(this.aggressiveMoto.militarySkill).toBe(5);
            expect(this.aggressiveMoto.politicalSkill).toBe(0);

            this.player2.pass();
            this.player1.clickCard(this.invocationOfAsh);
            this.player1.clickCard(this.aggressiveMoto);
            expect(this.aggressiveMoto.militarySkill).toBe(7);
            expect(this.aggressiveMoto.politicalSkill).toBe(2);

            this.player2.pass();
            this.player1.clickCard(this.curvedBlade);
            this.player1.clickCard(this.aggressiveMoto);
            expect(this.aggressiveMoto.militarySkill).toBe(10);
            expect(this.aggressiveMoto.politicalSkill).toBe(2);

            this.player2.playAttachment(this.katana2, this.initiate);

            this.noMoreActions();
            expect(this.getChatLogs(3)).toContain('player1 won a military conflict 3 vs 3');
        });

        it('allows attachment penalties', function () {
            this.noMoreActions();
            this.initiateConflict({
                attackers: [this.aggressiveMoto],
                defenders: [],
                province: this.shoreOfTheAshenFlames,
                type: 'military'
            });

            expect(this.aggressiveMoto.militarySkill).toBe(3);
            expect(this.aggressiveMoto.politicalSkill).toBe(0);

            this.player2.pass();
            this.player1.clickCard(this.fieryMadness);
            this.player1.clickCard(this.aggressiveMoto);
            expect(this.aggressiveMoto.militarySkill).toBe(1);
            expect(this.aggressiveMoto.politicalSkill).toBe(0);

            this.noMoreActions();
            expect(this.getChatLogs(3)).toContain('player1 won a military conflict 1 vs 0');
        });

        it('allows event bonuses', function () {
            this.noMoreActions();
            this.initiateConflict({
                attackers: [this.aggressiveMoto],
                defenders: [],
                province: this.shoreOfTheAshenFlames,
                type: 'military'
            });

            expect(this.aggressiveMoto.militarySkill).toBe(3);
            expect(this.aggressiveMoto.politicalSkill).toBe(0);

            this.player2.pass();
            this.player1.clickCard(this.perfectCut);
            this.player1.clickCard(this.aggressiveMoto);
            expect(this.aggressiveMoto.militarySkill).toBe(5);
            expect(this.aggressiveMoto.politicalSkill).toBe(0);

            this.noMoreActions();
            expect(this.getChatLogs(5)).toContain('player1 won a military conflict 5 vs 0');
        });

        it('testing pol', function () {
            this.noMoreActions();
            this.initiateConflict({
                attackers: [this.yoshi],
                defenders: [],
                province: this.shoreOfTheAshenFlames,
                type: 'political'
            });

            expect(this.yoshi.militarySkill).toBe(2);
            expect(this.yoshi.politicalSkill).toBe(6);

            this.player2.pass();
            this.player1.playAttachment(this.fineKatana, this.yoshi);
            expect(this.yoshi.militarySkill).toBe(4);
            expect(this.yoshi.politicalSkill).toBe(6);

            this.player2.pass();
            this.player1.playAttachment(this.invocationOfAsh, this.yoshi);
            expect(this.yoshi.militarySkill).toBe(6);
            expect(this.yoshi.politicalSkill).toBe(8);

            this.player2.pass();
            this.player1.playAttachment(this.fieryMadness, this.yoshi);
            expect(this.yoshi.militarySkill).toBe(4);
            expect(this.yoshi.politicalSkill).toBe(6);

            this.noMoreActions();
            expect(this.getChatLogs(5)).toContain('player1 won a political conflict 4 vs 0');
        });
    });
});

describe('Shore of the Ashen Flames and skill penalties', function () {
    integration(function () {
        beforeEach(function () {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    inPlay: ['brash-samurai']
                },
                player2: {
                    provinces: ['shore-of-the-ashen-flames'],
                    inPlay: [{ card: 'doji-whisperer', attachments: ['smoke'] }]
                }
            });
            this.brash = this.player1.findCardByName('brash-samurai');
            this.whisperer = this.player2.findCardByName('doji-whisperer');
            this.shore = this.player2.findCardByName('shore-of-the-ashen-flames', 'province 1');
            this.noMoreActions();
            this.initiateConflict({
                type: 'military',
                province: this.shore,
                attackers: [this.brash],
                defenders: [this.whisperer]
            });
        });

        it('doesn\'t stop a penalty from an attachment', function () {
            expect(this.game.currentConflict.attackerSkill).toBe(2);
            this.player2.clickCard('smoke');
            expect(this.game.currentConflict.attackerSkill).toBe(0);
        });
    });
});

describe('Shore of the Ashen Flames counts by side', function () {
    integration(function () {
        beforeEach(function () {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    inPlay: ['brash-samurai'],
                    dynastyDeck: ['utaku-rumaru'],
                    hand: ['join-the-fray', 'fine-katana']
                },
                player2: {
                    provinces: ['shore-of-the-ashen-flames'],
                    dynastyDeck: ['utaku-rumaru'],
                    hand: ['join-the-fray', 'fine-katana']
                }
            });
            this.brash = this.player1.findCardByName('brash-samurai');
            this.rumaru1 = this.player1.placeCardInProvince('utaku-rumaru', 'province 1');
            this.rumaru1.facedown = false;
            this.rumaru2 = this.player2.placeCardInProvince('utaku-rumaru', 'province 2');
            this.rumaru2.facedown = false;
            this.shore = this.player2.findCardByName('shore-of-the-ashen-flames', 'province 1');
            this.noMoreActions();
            this.initiateConflict({
                type: 'military',
                province: this.shore,
                attackers: [this.brash],
                defenders: []
            });
        });

        it('blocks attachment bonuses of a defender\'s character on the attacking side', function () {
            this.player2.clickCard(this.player2.findCardByName('join-the-fray'));
            this.player2.clickCard(this.rumaru2);
            this.player2.clickPrompt('player1');
            expect(this.game.currentConflict.attackers).toContain(this.rumaru2);
            this.player1.pass();
            this.player2.playAttachment(this.player2.findCardByName('fine-katana'), this.rumaru2);
            expect(this.rumaru2.militarySkill).toBe(6);

            this.noMoreActions();
            expect(this.getChatLogs(5)).toContain('player1 won a military conflict 6 vs 0');
        });

        it('keeps attachment bonuses of an attacker\'s character on the defending side', function () {
            this.player2.pass();
            this.player1.clickCard(this.player1.findCardByName('join-the-fray'));
            this.player1.clickCard(this.rumaru1);
            this.player1.clickPrompt('player2');
            expect(this.game.currentConflict.defenders).toContain(this.rumaru1);
            this.player2.pass();
            this.player1.playAttachment(this.player1.findCardByName('fine-katana'), this.rumaru1);

            this.noMoreActions();
            expect(this.getChatLogs(5)).toContain('player2 won a military conflict 6 vs 2');
        });
    });
});

describe('Shore of the Ashen Flames and a changed skill count', function () {
    integration(function () {
        beforeEach(function () {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    inPlay: ['shiba-ryuu', 'brash-samurai'],
                    hand: ['fine-katana']
                },
                player2: {
                    provinces: ['shore-of-the-ashen-flames']
                }
            });
            this.ryuu = this.player1.findCardByName('shiba-ryuu');
            this.brash = this.player1.findCardByName('brash-samurai');
            this.shore = this.player2.findCardByName('shore-of-the-ashen-flames', 'province 1');
        });

        it('counts combined skill (Shiba Ryuu) without the attachment bonus', function () {
            this.noMoreActions();
            this.initiateConflict({
                type: 'military',
                province: this.shore,
                attackers: [this.ryuu, this.brash],
                defenders: []
            });
            this.player2.pass();
            this.player1.playAttachment(this.player1.findCardByName('fine-katana'), this.brash);
            expect(this.brash.militarySkill).toBe(4);
            // Shiba Ryuu 2 + 3, Brash Samurai 2 + 1 (the Katana's +2 is blocked)
            expect(this.game.currentConflict.attackerSkill).toBe(8);
        });
    });
});
