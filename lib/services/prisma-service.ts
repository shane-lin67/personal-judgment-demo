import { db } from "@/lib/db";
import {
  mapConversationDetailFromDb,
  mapConversationListItemFromDb,
  mapImportJobFromDb,
  mapKnowledgeCardListItemFromDb,
  mapKnowledgeCardPreviewFromDb,
  mapTagItemFromDb
} from "@/lib/services/db-mappers";

export async function getDashboardDataFromDb() {
  const [conversationCount, knowledgeCardCount, tagCount, lastImport, recentConversations, recentCards] =
    await Promise.all([
      db.conversation.count(),
      db.knowledgeCard.count(),
      db.tag.count(),
      db.importJob.findFirst({
        orderBy: { createdAt: "desc" }
      }),
      db.conversation.findMany({
        take: 3,
        orderBy: { updatedAt: "desc" },
        include: {
          messages: true,
          conversationTags: { include: { tag: true } },
          knowledgeCards: true
        }
      }),
      db.knowledgeCard.findMany({
        take: 3,
        orderBy: { createdAt: "desc" }
      })
    ]);

  return {
    overview: {
      conversationCount,
      knowledgeCardCount,
      tagCount,
      lastImportLabel: lastImport ? lastImport.createdAt.toISOString().slice(0, 16).replace("T", " ") : "暂无导入"
    },
    recentConversations: recentConversations.map(mapConversationListItemFromDb),
    recentKnowledgeCards: recentCards.map(mapKnowledgeCardPreviewFromDb)
  };
}

export async function getConversationListFromDb() {
  const conversations = await db.conversation.findMany({
    orderBy: { updatedAt: "desc" },
    include: {
      messages: true,
      conversationTags: { include: { tag: true } },
      knowledgeCards: true
    }
  });

  return conversations.map(mapConversationListItemFromDb);
}

export async function getConversationByIdFromDb(id: string) {
  const conversation = await db.conversation.findUnique({
    where: { id },
    include: {
      messages: {
        orderBy: { sequenceIndex: "asc" }
      },
      conversationTags: { include: { tag: true } },
      knowledgeCards: true,
      relatedConversations: {
        include: {
          relatedConversation: true
        },
        orderBy: { score: "desc" },
        take: 5
      }
    }
  });

  return conversation ? mapConversationDetailFromDb(conversation) : null;
}

export async function getImportJobsFromDb() {
  const jobs = await db.importJob.findMany({
    orderBy: { createdAt: "desc" }
  });

  return jobs.map(mapImportJobFromDb);
}

export async function getImportJobByIdFromDb(id: string) {
  const job = await db.importJob.findUnique({ where: { id } });
  return job ? mapImportJobFromDb(job) : null;
}

export async function getKnowledgeCardsFromDb() {
  const cards = await db.knowledgeCard.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      conversation: {
        include: {
          conversationTags: { include: { tag: true } }
        }
      }
    }
  });

  return cards.map(mapKnowledgeCardListItemFromDb);
}

export async function getKnowledgeCardByIdFromDb(id: string) {
  const card = await db.knowledgeCard.findUnique({
    where: { id },
    include: {
      conversation: {
        include: {
          conversationTags: { include: { tag: true } }
        }
      }
    }
  });

  return card ? mapKnowledgeCardListItemFromDb(card) : null;
}

export async function getTagsFromDb() {
  const tags = await db.tag.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      _count: {
        select: {
          conversationTags: true
        }
      }
    }
  });

  return tags.map(mapTagItemFromDb);
}

export async function updateConversationTagsInDb(input: { conversationId: string; tagIds: string[] }) {
  await db.conversationTag.deleteMany({
    where: { conversationId: input.conversationId }
  });

  if (input.tagIds.length) {
    await db.conversationTag.createMany({
      data: input.tagIds.map((tagId) => ({
        conversationId: input.conversationId,
        tagId
      }))
    });
  }

  return {
    conversationId: input.conversationId,
    tagIds: input.tagIds,
    updatedAt: new Date().toISOString()
  };
}
